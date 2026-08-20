using UnityEngine;

public class DeviceManager : MonoBehaviour
{
    public ApiClient apiClient;
    // public DeviceSpawner spawner;

    void Start()
    {
        apiClient.GetSnapshot(snapshot =>
            {
                if (snapshot == null)
                {
                    Debug.LogError("[APP] Snapshot is NULL");
                    return;
                }

                Debug.Log($"[APP] Entities: {snapshot.entities?.Length}");

                Debug.Log($"[APP] Contexts: {snapshot.spatialContexts?.Length}");
            }
        );

        apiClient.GetUnconfiguredDevices(unconfiguredDevices =>
            {
                if (unconfiguredDevices == null)
                {
                    Debug.LogError("[APP] Unconfigured devices is NULL");
                    return;
                }

                Debug.Log($"[APP] Unconfigured devices: {unconfiguredDevices.Length}");

                if (unconfiguredDevices.Length > 0)
                {
                    string message = unconfiguredDevices.Length == 1 ? "Hay un dispositivo nuevo pendiente de configurar."
                    : $"Hay {unconfiguredDevices.Length} dispositivos nuevos pendientes de configurar.";

                    Debug.Log("[APP] " + message);
                }
            }
        );
    }
}