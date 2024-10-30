
### Run Katana
```bash
katana --disable-fee --allowed-origins="*"
```

### Build and migrate
```bash
sozo build && sozo migrate apply
```

### Run Torii

```bash
torii -w 0x16f1addde92042f4082e941906f4ec379981958c46098898f93bb99b4c2d655
```  
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