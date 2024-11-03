import { addAddressPadding } from "starknet";

export const queryEntities = (accountAddress: string) => {
    return {
        depths_of_dread: {
            PlayerData: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            PlayerState: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            GameData: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                    order: {
                        field: "game_id", // Replace with your field name to sort by, such as start_time or end_time
                        direction: "DESC", // Sorts in descending order for latest first
                    },
                },
            },
        },
    };
};

export const subscribeEntity = (accountAddress: string) => {
    return {
        depths_of_dread: {
            PlayerData: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            PlayerState: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            GameData: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
        },
    };
};

export const subscribeEvent = (accountAddress: string) => {
    return {
        depths_of_dread: {
            PlayerCreated: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            GameCreated: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
            Moved: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(
                                accountAddress
                            ),
                        },
                    },
                },
            },
        },
    };
};