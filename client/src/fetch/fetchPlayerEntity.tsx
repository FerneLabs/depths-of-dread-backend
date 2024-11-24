import { DepthsOfDreadSchemaType } from "../bindings/models.gen";
import { SDK } from "@dojoengine/sdk";
import { queryPlayerData } from "../queries/queries";

const fetchPlayerEntity = async (
    sdk: SDK<DepthsOfDreadSchemaType>, 
    address: string 
) => {
    let data = null;

    try {
        await sdk.getEntities(
            queryPlayerData(address),
            (resp) => {
                if (resp.error) {
                    console.error(
                        "resp.error.message:",
                        resp.error.message
                    );
                    return;
                }
                if (resp.data && resp.data.length > 0) {
                    console.log("FETCH ENTITTIES", resp.data);
                    data = resp.data;
                } else {
                    console.log("FETCH ENTITTIES", resp);
                }
            }
        );
    } catch (error) {
        console.error("Error querying entities:", error);
    }

    return data;
};

export default fetchPlayerEntity;