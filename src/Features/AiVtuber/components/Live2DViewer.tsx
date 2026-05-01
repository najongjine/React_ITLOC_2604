import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";
import { Ticker } from "@pixi/ticker";
import {
    Live2DModel,
    MotionPreloadStrategy,
} from "pixi-live2d-display/cubism4";
import { MAO_MOTIONS, MaoMotionKey } from "../utils/constants";
import { Live2DController } from "../types";

// Expose PIXI to window for pixi-live2d-display
(window as any).PIXI = PIXI;

interface Live2DViewerProps {
    isSpeaking: boolean;
    modelUrl?: string;
}

const Live2DViewer = forwardRef<Live2DController, Live2DViewerProps>(
    (
        { isSpeaking, modelUrl = "/mao_pro_ko/runtime/mao_pro.model3.json" },
        ref
    ) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const appRef = useRef<PIXI.Application | null>(null);
        const modelRef = useRef<Live2DModel | null>(null);
        const isSpeakingRef = useRef(isSpeaking);
        const mouthOpenParamIndexRef = useRef<number>(-1);
        const expressionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

        const positionModel = () => {
            const model = modelRef.current;
            if (!model) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const scale =
                width < 640 ? 0.07 :
                    width < 920 ? 0.085 :
                        width < 1180 ? 0.1 :
                            width < 1500 ? 0.12 : 0.135;

            model.anchor.set(0.5, 0.5);
            model.x =
                width < 640 ? 92 :
                    width < 920 ? 130 :
                        width < 1180 ? 170 :
                            width < 1500 ? 225 : 280;
            model.y = height * (width < 640 ? 0.58 : 0.62);
            model.scale.set(scale);
        };

        useEffect(() => {
            isSpeakingRef.current = isSpeaking;
        }, [isSpeaking]);

        useImperativeHandle(ref, () => ({
            playMotion: (motionKey: any) => {
                if (!modelRef.current) return;
                const key = motionKey as MaoMotionKey;
                const motion = MAO_MOTIONS[key];
                if (!motion) return;

                console.log(`Playing Motion: ${key}`);
                // Ensure strictly typed group and index usage
                modelRef.current.motion(motion.group, motion.index, 3);
            },
            setExpression: (expressionId: string) => {
                if (!modelRef.current) return;

                // Reset existing timer if a new expression is set
                if (expressionTimeoutRef.current) {
                    clearTimeout(expressionTimeoutRef.current);
                    expressionTimeoutRef.current = null;
                }

                const internalModel = modelRef.current.internalModel as any;
                if (internalModel.motionManager && internalModel.motionManager.expressionManager) {
                    console.log(`Setting Expression: ${expressionId}`);
                    try {
                        internalModel.motionManager.expressionManager.setExpression(expressionId);

                        // Auto-revert to default expression (exp_01) after 5 seconds
                        if (expressionId !== "exp_01") {
                            expressionTimeoutRef.current = setTimeout(() => {
                                const currentModel = modelRef.current;
                                if (currentModel?.internalModel?.motionManager?.expressionManager) {
                                    console.log("Auto Reverting to Default Expression (exp_01)");
                                    (currentModel.internalModel as any).motionManager.expressionManager.setExpression("exp_01");
                                }
                                expressionTimeoutRef.current = null;
                            }, 5000);
                        }
                    } catch (e) {
                        console.error("Expression Error:", e);
                    }
                } else {
                    console.warn("ExpressionManager not found");
                }
            },
            stopSpeaking: () => {
                if (modelRef.current && mouthOpenParamIndexRef.current !== -1) {
                    const core: any = modelRef.current.internalModel.coreModel;
                    core?.setParameterValueByIndex(mouthOpenParamIndexRef.current, 0);
                }
            },
        }));

        useEffect(() => {
            if (!canvasRef.current || appRef.current) return;

            let isMounted = true;
            let tickerFn: (() => void) | null = null;
            let modelUpdateFn: (() => void) | null = null;
            let renderFn: (() => void) | null = null;
            let ownsTicker = false;
            let app: PIXI.Application;
            try {
                app = new PIXI.Application({
                    view: canvasRef.current,
                    resizeTo: window,
                    backgroundAlpha: 0,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });
            } catch (e) {
                console.error("PIXI Application creation failed:", e);
                return;
            }
            appRef.current = app;
            const ticker = ((app as any).ticker as Ticker | undefined) ?? new Ticker();
            ownsTicker = !(app as any).ticker;

            if (ownsTicker) {
                ticker.autoStart = true;
                renderFn = () => app.render();
                ticker.add(renderFn);
            }

            const init = async () => {
                try {
                    if (!isMounted) {
                        return;
                    }

                    console.log("Live2D model loading:", modelUrl);
                    const model = await Live2DModel.from(modelUrl, {
                        motionPreload: MotionPreloadStrategy.NONE,
                        autoInteract: false,
                    });

                    if (!isMounted || !app.stage) {
                        model.destroy();
                        return;
                    }

                    app.stage.addChild(model as any);
                    modelRef.current = model;
                    positionModel();
                    console.log("Live2D model positioned:", {
                        x: model.x,
                        y: model.y,
                        scaleX: model.scale.x,
                        scaleY: model.scale.y,
                        width: model.width,
                        height: model.height,
                    });
                    model.interactive = true;

                    const internalModel = model.internalModel as any;
                    const coreModel = internalModel.coreModel as any;
                    const index = coreModel._parameterIds.indexOf("ParamA");
                    mouthOpenParamIndexRef.current = index;

                    if (internalModel.motionManager) {
                        console.log("Starting Idle Motion...");
                        internalModel.motionManager.startMotion("Idle", 0);
                    }

                    if (internalModel.motionManager?.expressionManager) {
                        console.log("ExpressionManager Loaded");
                    } else {
                        console.warn("ExpressionManager NOT Loaded");
                    }

                    tickerFn = () => {
                        const currentModel = modelRef.current;
                        if (!currentModel) return;

                        const currentInternalModel = currentModel.internalModel as any;
                        const coreModel = currentInternalModel?.coreModel as any;
                        const mouthIndex = mouthOpenParamIndexRef.current;

                        if (!coreModel || mouthIndex === -1) return;

                        if (isSpeakingRef.current) {
                            const mouthValue = Math.abs(Math.sin(Date.now() / 90)) * 0.8 + 0.2;
                            coreModel.setParameterValueByIndex(mouthIndex, mouthValue);
                        } else {
                            coreModel.setParameterValueByIndex(mouthIndex, 0);
                        }
                    };

                    modelUpdateFn = () => {
                        modelRef.current?.update(ticker.deltaMS);
                    };

                    ticker.add(tickerFn);
                    ticker.add(modelUpdateFn);
                    ticker.start();
                } catch (e) {
                    console.error("Model Load Failed:", e);
                }
            };

            init();

            return () => {
                isMounted = false;
                if (expressionTimeoutRef.current) {
                    clearTimeout(expressionTimeoutRef.current);
                    expressionTimeoutRef.current = null;
                }
                if (tickerFn) ticker.remove(tickerFn);
                if (modelUpdateFn) ticker.remove(modelUpdateFn);
                if (renderFn) ticker.remove(renderFn);
                if (ownsTicker) {
                    ticker.stop();
                    ticker.destroy();
                }
                modelRef.current = null;
                mouthOpenParamIndexRef.current = -1;
                app.destroy(false, { children: true });
                appRef.current = null;
            };
        }, [modelUrl]);

        // Look at pointer logic
        useEffect(() => {
            const handleResize = () => {
                positionModel();
            };

            const handlePointerMove = (event: PointerEvent) => {
                if (!modelRef.current) return;

                const x = event.clientX - modelRef.current.x;
                const y = event.clientY - modelRef.current.y;

                modelRef.current.focus(x, y);
            };

            window.addEventListener("resize", handleResize);
            window.addEventListener("pointermove", handlePointerMove);
            return () => {
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("pointermove", handlePointerMove);
            };
        }, []);

        return (
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            />
        );
    }
);

export default Live2DViewer;
