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

export const queryPlayerData = (accountAddress: string) => {
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
        }
    };  
};

export const queryGameData = (game_id: number) => {
    return {
        depths_of_dread: {
            GameData: {
                $: {
                    where: {
                        game_id: {
                            $eq: game_id
                        },
                    },
                },
            },
        }
    };  
};

export const queryGames = () => {
    return {
        depths_of_dread: {
            GameData: {
                $: {
                    orderBy: {
                        total_score: 'desc'  // Use 'asc' for ascending order
                    },
                    limit: 20
                },
            },
        }
    };  
};

export const subscribePlayer = (accountAddress: string) => {
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
            }
        }
    };
};

export const subscribeGame = (game_id: number) => {
    return {
        depths_of_dread: {
            GameData: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
            GameFloor: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
            GameCoins: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
            GameObstacles: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
        }
    };
};

export const subscribeEntity = (accountAddress: string, game_id: number) => {
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
            GameFloor: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
            GameCoins: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
                        },
                    },
                },
            },
            GameObstacles: {
                $: {
                    where: {
                        game_id: {
                            $is: game_id
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