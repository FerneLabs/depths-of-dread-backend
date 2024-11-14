import { DepthsOfDreadSchemaType } from "../bindings/models.gen";
import { SDK } from "@dojoengine/sdk";
import { subscribePlayer } from "../queries/queries";

const subscribePlayerEntity = async ( 
    sdk: SDK<DepthsOfDreadSchemaType>, 
    address: string
) => {
    let data = null;

    const subscription = await sdk.subscribeEntityQuery(
        subscribePlayer(address),
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
                console.log("SUBSCRIBE", response.data);
                data = response.data[0];
                // Update state with incoming data
                // response.data.forEach((entity) => {
                //     const model = entity.models.depths_of_dread;
                //     if (model?.PlayerData) {
                //         setPlayerData(model.PlayerData);
                //     } else if (model?.PlayerState) {
                //         setPlayerState(model.PlayerState);
                //     } else if (model?.GameData && model?.GameData.end_time === "0x0") {
                //         setGameData(model.GameData);
                //     } else if (model?.GameFloor) {
                //         setGameFloor(model.GameFloor);
                //     } else if (model?.GameCoins) {
                //         setGameCoins(model.GameCoins);
                //     }
                // });
            }
        },
        { logging: false }
    );

    // unsubscribe = () => subscription.cancel();
    return data;
};

export default subscribePlayerEntity;