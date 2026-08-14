using UnityEngine;

public class DeviceManager : MonoBehaviour
{
    public ApiClient apiClient;
    public DeviceSpawner spawner;

    void Start()
    {
        apiClient.GetSnapshot( snapshot => {
                spawner.SpawnContexts(
                    snapshot.spatialContexts
                );
            }
        );
    }
}