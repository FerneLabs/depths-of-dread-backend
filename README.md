
### Run Katana
```bash
katana --disable-fee --allowed-origins="*"
```

### Build and migrate
```bash
sozo build && sozo migrate
```

### Run Torii

```bash
# Get world address
sozo inspect

# Run torii
torii --world WORLD_ADDRESS --allowed-origins "*"
```  

### Run client:
```
npm run dev 
```

## How to play
In depths of Dread, the objective is to scape the maze by clearing a different set of floors.

Every floor is filled with traps and coins, that can be collected to increase the run score.

You will get a hint of the path to follow in the beginning of every floor to know where to go.

If a trap is encountered on the way, the progress is reset.


### GraphQL Inspection:
### Go to GraphQL playground:  
[http://localhost:8080/graphql](http://localhost:8080/graphql)  

### GraphQL Queries:

<details>
  <summary>Subscribe to all entity updates</summary>

  ```graphql
   subscription {
      entityUpdated {
         id
         keys
         models {
            __typename
            ... on depths_of_dread_PlayerData {
               username
            }
            ... on depths_of_dread_PlayerState {
               game_id
               position {
                  x
                  y
               }
            }
            ... on depths_of_dread_GameData {
               player
            }
         }
      }
   }
  ```

</details>

<details>
  <summary>Query PlayerData</summary>

  ```graphql
   query {
      depthsOfDreadPlayerDataModels {
         edges {
            node {
               username
            }
         }
      }
   }
  ```
  
</details>

<details>
  <summary>Query PlayerState</summary>

  ```graphql
   query {
      depthsOfDreadPlayerStateModels {
         edges {
            node {
               player
               game_id
               current_floor
               coins
               position {
                  x
                  y
               }
            }
         }
      }
   }
  ```
  
</details>

<details>
  <summary>Query GameData</summary>

  ```graphql
   query {
      overdrivePlayerAccountModels {
         edges {
            node {
               game_id
               player
               floor_reached
               total_score
               start_time
               end_time
            }
         }
      }
   }
  ```
  
</details>


