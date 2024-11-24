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
            }
        },
        { logging: false }
    );

    await subscription();
    // unsubscribe = () => subscription.cancel();
    return data;
};

export default subscribePlayerEntity;