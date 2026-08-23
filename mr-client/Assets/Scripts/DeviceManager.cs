using UnityEngine;
using System;

public class DeviceManager : MonoBehaviour
{
    public ApiClient apiClient;

    public DeviceSpawner spawner;

    public ConfigurationPopupController popup; 
    
    public ConfigurationManager configurationManager;

    [SerializeField]
    private float refreshInterval = 10f;

    private SpatialContext[] spatialContexts;

    void Start()
    {
        apiClient.GetSpatialContexts(receivedContexts =>
        {
            if (receivedContexts == null)
            {
                Debug.LogError("[APP] Spatial contexts is NULL");
                return;
            }

            spatialContexts = receivedContexts;

            StartCoroutine(RefreshLoop());

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
        popup.ShowInFrontOfCamera();

        popup.Setup(pendingDevices, () => {
                popup.StopFollowing();
                popup.gameObject.SetActive(false);
                configurationManager.StartConfiguration();
            },
            () => {
                popup.StopFollowing();
                popup.gameObject.SetActive(false);
                ShowConfiguredDevices();
            });
    }

    public void ShowConfiguredDevices()
    {
        if (spatialContexts == null)
        {
            return;
        }

        spawner.UpdateOrSpawnDevices(
            spatialContexts
        );
    }

    public void RefreshSnapshot(Action onComplete = null)
    {
        apiClient.GetSpatialContexts(receivedContexts =>
        {
            if (receivedContexts == null)
            {
                Debug.LogError("[APP] Spatial contexts is NULL");
                return;
            }

            spatialContexts = receivedContexts;

            onComplete?.Invoke();
        });
    }

    private System.Collections.IEnumerator RefreshLoop()
    {
        while (true)
        {
            yield return new WaitForSeconds(refreshInterval);

            RefreshSnapshot(() =>
            {
                ShowConfiguredDevices();
            });
        }
    }
}