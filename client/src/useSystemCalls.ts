import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "./App";
import { useDojo } from "./useDojo";
import { v4 as uuidv4 } from "uuid";
import { stringToFelt } from "./utils/feltService";
import { useController } from "./ControllerProvider";
import { BurnerAccount } from "@dojoengine/create-burner";
import { Direction, GameFloor, PlayerState } from "./bindings/models.gen";
import { useMemo } from "react";


export const useSystemCalls = () => {
    const { controller } = useController();
    const state = useDojoStore((state) => state);

    const {
        setup: { client },
        account: { account },
    } = useDojo();

    const playerEntityId = useMemo(
        () => getEntityIdFromKeys([BigInt(controller?.account?.address || 0)]),
        [controller?.account?.address]
    );

    const gameEntityId = (gameId: number) => getEntityIdFromKeys([BigInt(gameId)]);

    const createPlayer = async (username: string) => {
        console.log("Creating a new player with username", username);

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // The value to update the PlayerData model with
        const feltUsername = stringToFelt(username);

        // Apply an optimistic update to the state
        // this uses immer drafts to update the state
        state.applyOptimisticUpdate(transactionId, (draft) => {
            if (draft.entities[playerEntityId]?.models?.depths_of_dread?.PlayerData) {
                draft.entities[playerEntityId].models.depths_of_dread.PlayerData.username = feltUsername;
            }
        });

        try {
            // Execute the create action from the client
            await client.actions.createPlayer({
                account: controller.account,
                username: feltUsername,
            });

            // Wait for the entity to be updated with the new state
            await state.waitForEntityChange(playerEntityId, (entity) => {
                return (
                    entity?.models?.depths_of_dread?.PlayerData?.username === feltUsername
                );
            });
        } catch (error) {
            // Revert the optimistic update if an error occurs
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing create_player:", error);
            throw error;
        } finally {
            // Confirm the transaction if successful
            state.confirmTransaction(transactionId);
        }
    };

    const createGame = async () => {
        console.log("Creating a new game");
        try {
            return await client.actions.createGame({
                account: controller?.account ? controller?.account : account,
            });
        } catch (error) {
            console.error("Error executing create_game:", error);
            throw error;
        }
    };

    const move = async (playerState: PlayerState, gameFloor: GameFloor, direction: Direction) => {
        console.log("Moving player", direction);

        try {
            // Execute the create action from the client
            await client.actions.move({
                account: controller.account,
                direction: direction,
            });
        } catch (error) {
            console.error("Error executing move:", error);
            throw error;
        }
    };

    const endGame = async () => {
        try {
            return await client.actions.endGame({
                account: controller?.account ? controller?.account : account,
            });
        } catch (error) {
            console.error("Error executing end_game:", error);
            throw error;
        }
    };

    return {
        createPlayer,
        createGame,
        move,
        endGame
    };
};
