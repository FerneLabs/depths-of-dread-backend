import { DepthsOfDreadSchemaType } from "../bindings/models.gen";
import { SDK } from "@dojoengine/sdk";
import { subscribeGame } from "../queries/queries";

const subscribeGameEntity = async ( 
    sdk: SDK<DepthsOfDreadSchemaType>, 
    game_id: number
) => {
    let data = null;

    const subscription = await sdk.subscribeEntityQuery(
        subscribeGame(game_id),
        (response) => {
            if (response.error) {
                console.error(
                    "Error setting up entity sync:",
                    response.error
                );
            } else if (
                response.data &&
                response.data[0].entityId !== "0x0"
            ) {
                console.log("SUBSCRIBE GAME", response.data);
                data = response.data[0];
            }
        },
        { logging: false }
    );

    // unsubscribe = () => subscription.cancel();
    return data;
};

export default subscribeGameEntity;