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
                    // Update state
                    // TODO: Maybe store state for whole entity instead of individual models?
                    console.log("FETCH ENTITTIES", resp.data);
                    data = resp.data;

                    // const playerData = resp.data.find(entity => entity.models.depths_of_dread?.PlayerData);
                    // const playerState = resp.data.find(entity => entity.models.depths_of_dread?.PlayerState);

                    // // TODO: after game over is created in backed, add a predicate in the find expression
                    // // to get only the currently active game (gameData.isActive), games should be set as inactive when finished.
                    // const gameData = resp.data.find(entity =>
                    //     entity.models.depths_of_dread?.GameData
                    //     && entity.models.depths_of_dread?.GameData.end_time === "0x0"
                    // );
                    // console.log(gameData);
                    // const gameFloor = resp.data.find(entity =>
                    //     entity.models.depths_of_dread?.GameFloor
                    //     && entity.models.depths_of_dread?.GameFloor.game_id === gameData.models.depths_of_dread.GameData.game_id
                    // );
                    // const gameObstacles = resp.data.find(entity =>
                    //     entity.models.depths_of_dread?.gameObstacles
                    //     && entity.models.depths_of_dread?.gameObstacles.game_id === gameData.models.depths_of_dread.GameData.game_id
                    // );
                    // const gameCoins = resp.data.find(entity =>
                    //     entity.models.depths_of_dread?.gameCoins
                    //     && entity.models.depths_of_dread?.gameCoins.game_id === gameData.models.depths_of_dread.GameData.game_id
                    // );

                    // setPlayerData(playerData?.models.depths_of_dread.PlayerData || null);
                    // setPlayerState(playerState?.models.depths_of_dread.PlayerState || null);
                    // setGameData(gameData?.models.depths_of_dread.GameData || null);
                    // setGameFloor(gameFloor?.models.depths_of_dread.GameFloor || null);
                    // setGameObstacles(gameObstacles?.models.depths_of_dread.GameObstacles || null);
                    // setGameCoins(gameCoins?.models.depths_of_dread.GameCoins || null);
                }
            }
        );
    } catch (error) {
        console.error("Error querying entities:", error);
    }

    return data;
};

export default fetchPlayerEntity;