// Generated by dojo-bindgen on Wed, 30 Oct 2024 17:53:29 +0000. Do not modify this file manually.
using System;
using System.Threading.Tasks;
using Dojo;
using Dojo.Starknet;
using UnityEngine;
using dojo_bindings;
using System.Collections.Generic;
using System.Linq;
using Enum = Dojo.Starknet.Enum;

// System definitions for `depths_of_dread-actions` contract
public class Actions : MonoBehaviour {
    // The address of this contract
    public string contractAddress;

    
    // Call the `create_player` system with the specified Account and calldata
    // Returns the transaction hash. Use `WaitForTransaction` to wait for the transaction to be confirmed.
    public async Task<FieldElement> create_player(Account account, FieldElement username) {
        List<dojo.FieldElement> calldata = new List<dojo.FieldElement>();
        calldata.Add(username.Inner);

        return await account.ExecuteRaw(new dojo.Call[] {
            new dojo.Call{
                to = contractAddress,
                selector = "create_player",
                calldata = calldata.ToArray()
            }
        });
    }
            

    
    // Call the `create_game` system with the specified Account and calldata
    // Returns the transaction hash. Use `WaitForTransaction` to wait for the transaction to be confirmed.
    public async Task<FieldElement> create_game(Account account) {
        List<dojo.FieldElement> calldata = new List<dojo.FieldElement>();
        

        return await account.ExecuteRaw(new dojo.Call[] {
            new dojo.Call{
                to = contractAddress,
                selector = "create_game",
                calldata = calldata.ToArray()
            }
        });
    }
            

    
    // Call the `move` system with the specified Account and calldata
    // Returns the transaction hash. Use `WaitForTransaction` to wait for the transaction to be confirmed.
    public async Task<FieldElement> move(Account account, Direction direction) {
        List<dojo.FieldElement> calldata = new List<dojo.FieldElement>();
        calldata.Add(new FieldElement(Enum.GetIndex(direction)).Inner);

        return await account.ExecuteRaw(new dojo.Call[] {
            new dojo.Call{
                to = contractAddress,
                selector = "move",
                calldata = calldata.ToArray()
            }
        });
    }
            

    
    // Call the `dojo_init` system with the specified Account and calldata
    // Returns the transaction hash. Use `WaitForTransaction` to wait for the transaction to be confirmed.
    public async Task<FieldElement> dojo_init(Account account) {
        List<dojo.FieldElement> calldata = new List<dojo.FieldElement>();
        

        return await account.ExecuteRaw(new dojo.Call[] {
            new dojo.Call{
                to = contractAddress,
                selector = "dojo_init",
                calldata = calldata.ToArray()
            }
        });
    }
            
}
        