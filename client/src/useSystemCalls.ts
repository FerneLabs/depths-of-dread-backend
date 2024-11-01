import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "./App";
import { useDojo } from "./useDojo";
import { v4 as uuidv4 } from "uuid";

const stringToFelt252 = (value: string): bigint => {
    let encoded = "0x";
    for (const char of value) {
        const hex = char.charCodeAt(0).toString(16).padStart(2, "0");  // Convert to hex
        encoded += hex;
    }
    return BigInt(encoded);
}

export const useSystemCalls = () => {
    const state = useDojoStore((state) => state);

    const {
        setup: { client },
        account: { account },
    } = useDojo();

    const generateEntityId = () => {
        return getEntityIdFromKeys([BigInt(account?.address)]);
    };

    const createPlayer = async (username: string) => {
        // Generate a unique entity ID
        const entityId = generateEntityId();

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // The value to update the PlayerData model with
        const feltUsername = stringToFelt252(username);

        // Apply an optimistic update to the state
        // this uses immer drafts to update the state
        state.applyOptimisticUpdate(transactionId, (draft) => {
            if (draft.entities[entityId]?.models?.depths_of_dread?.PlayerData) {
                draft.entities[entityId].models.depths_of_dread.PlayerData.username = feltUsername;
            }
        });

        try {
            // Execute the spawn action from the client
            await client.actions.createPlayer({
                account: account,
                username: feltUsername,
            });

            // Wait for the entity to be updated with the new state
            await state.waitForEntityChange(entityId, (entity) => {
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

        console.log("Created a new player with username", username);
    };



    return {
        createPlayer,
    };
};
