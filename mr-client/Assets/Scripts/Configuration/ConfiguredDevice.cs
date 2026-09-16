using UnityEngine;

public class ConfiguredDevice : MonoBehaviour
{

    private GameObject panelPrefab;

    private GameObject devicePanelGO;

    private DeviceInfoPanelController panel;

    private IoTEntity entity;
    public string EntityId => entity?.id;

    public void Initialize(GameObject panelPrefab)
    {
        this.panelPrefab = panelPrefab;
    }

    public void Setup(IoTEntity entity)
    {
        this.entity = entity;
    }

    private void Start()
    {
        if (panelPrefab == null)
        {
            return;
        }

        devicePanelGO = Instantiate(panelPrefab, transform);

        Vector3 dirToCamera = (Camera.main.transform.position - transform.position).normalized;

        devicePanelGO.transform.position =  transform.position + transform.right * -0.3f + dirToCamera * 0.25f;

        panel = devicePanelGO.GetComponent<DeviceInfoPanelController>();

        devicePanelGO.SetActive(false);

        if (panel != null && entity != null)
        {
            panel.Setup(entity);
        }
    }

    public void ShowInfoPanel()
    {
        
        if (panel != null && entity != null)
        {
            panel.Setup(entity);
        }

        devicePanelGO.SetActive(true); 
    }

    public void HideInfoPanel()
    {
        if (devicePanelGO != null)
        {
            devicePanelGO.SetActive(false);
        }
    }

    private void LateUpdate()
    {
        if (devicePanelGO != null && devicePanelGO.activeSelf) {
            Vector3 dir = Camera.main.transform.position - devicePanelGO.transform.position;

            devicePanelGO.transform.rotation = Quaternion.LookRotation(dir);

            devicePanelGO.transform.Rotate(0f, 180f, 0f);
        }
    }

    public void UpdateEntity(IoTEntity newEntity)
    {

        entity = newEntity;
        if (panel != null)
        {
            panel.Setup(entity);
        }
    }
}