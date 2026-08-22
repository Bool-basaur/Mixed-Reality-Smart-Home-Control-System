using UnityEngine;

public class DeviceManager : MonoBehaviour
{
    public ApiClient apiClient;

    public DeviceSpawner spawner;

    public ConfigurationPopupController popup; 
    
    public ConfigurationManager configurationManager;

    private Snapshot snapshot;

    void Start()
    {
        apiClient.GetSnapshot(receivedSnapshot =>
        {
            if (receivedSnapshot == null)
            {
                Debug.LogError("[APP] Snapshot is NULL");
                return;
            }

            snapshot = receivedSnapshot;

            apiClient.GetUnconfiguredDevices(devices =>
            {
                if (devices == null)
                {
                    Debug.LogError("[APP] Unconfigured devices is NULL");
                    return;
                }

                Debug.Log($"[APP] Unconfigured devices: {devices.Length}");

                if (devices.Length > 0)
                {
                    ShowConfigurationPopup(devices.Length);
                }
                else
                {
                    ShowConfiguredDevices();
                }
            });
        });
    }

    private void ShowConfigurationPopup(int pendingDevices)
    {
        Debug.Log("[APP] SHOWING CONFIGURATION POPUP");
        popup.ShowInFrontOfCamera();

        popup.Setup(pendingDevices, () =>
            {
                Debug.Log("[APP] Accept clicked"); 
                popup.StopFollowing();
                popup.gameObject.SetActive(false);
                configurationManager.StartConfiguration();
            },
            () =>
            {
                Debug.Log("[APP] Cancel clicked");
                popup.StopFollowing();
                popup.gameObject.SetActive(false);
                ShowConfiguredDevices();
            });
    }

    private void ShowConfiguredDevices()
    {
        if (snapshot == null)
        {
            return;
        }

        spawner.SpawnConfiguredDevices(
            snapshot.spatialContexts
        );
    }

}