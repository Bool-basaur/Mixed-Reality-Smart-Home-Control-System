using UnityEngine;
using System;

public class PendingConfigurationDevice : MonoBehaviour
{
    private GameObject panelPrefab;

    private GameObject devicePanelGO;

    private UnconfiguredDeviceInfoPanelController panel;

    private string entityId;

    private string deviceName;

    private string category;

    public event Action OnDeviceFixed;

    public string EntityId => entityId;

    public string DeviceName => deviceName;

    public string Category => category;

    public void Initialize(GameObject panelPrefab)
    {
        this.panelPrefab = panelPrefab;
    }

    public void Setup(UnconfiguredDevice device)
    {
        entityId = device.id;
        deviceName = device.name;
        category = device.category;
    }

    private void Start()
    {
        if (panelPrefab == null)
        {
            return;
        }

        devicePanelGO = Instantiate(panelPrefab, transform);

        devicePanelGO.transform.localPosition = new Vector3(-1f, 1f, -0.5f);

        panel = devicePanelGO.GetComponent<UnconfiguredDeviceInfoPanelController>();

        devicePanelGO.SetActive(true);

        if (panel != null)
        {
            panel.Setup(new UnconfiguredDevice
            {
                id = entityId,
                name = deviceName,
                category = category
            });

            panel.OnFixRequested -= OnFixRequested;
            panel.OnFixRequested += OnFixRequested;
        }
    }

    private void LateUpdate()
    {
        if (devicePanelGO != null &&
            devicePanelGO.activeSelf)
        {
            Vector3 direction = Camera.main.transform.position - devicePanelGO.transform.position;

            devicePanelGO.transform.rotation = Quaternion.LookRotation(direction);

            devicePanelGO.transform.Rotate(0f, 180f, 0f);
        }
    }

    public void ShowInfoPanel()
    {
        if (devicePanelGO != null)
        {
            devicePanelGO.SetActive(true);
        }
    }

    public void HideInfoPanel()
    {
        if (devicePanelGO != null)
        {
            devicePanelGO.SetActive(false);
        }
    }

    private void OnFixRequested()
    {

        OnDeviceFixed?.Invoke();
    }
}