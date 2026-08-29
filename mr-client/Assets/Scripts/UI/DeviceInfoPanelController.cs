using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class DeviceInfoPanelController : MonoBehaviour
{
    [SerializeField]
    private TMP_Text titleText; 
    
    [SerializeField]
    private Button exitButton;

    [SerializeField]
    private TMP_Text stateText;

    [SerializeField]
    private TMP_Text capabilitiesText;

    [SerializeField]
    private Transform actionsContainer;

    [SerializeField]
    private ActionButton actionButtonPrefab;

    [SerializeField]
    private GameObject actionsLoadingContainer;

    private ApiClient apiClient;

    private DeviceManager deviceManager;

    private void Awake()
    {
        apiClient = FindFirstObjectByType<ApiClient>();
        deviceManager = FindFirstObjectByType<DeviceManager>();
    }
    private void Start()
    {
        exitButton.onClick.AddListener(ClosePanel);
    }

    private void OnDestroy()
    {
        exitButton.onClick.RemoveListener(ClosePanel);
    }

    public void Setup(IoTEntity entity)
    {
        titleText.text = entity.name;

        stateText.text = $"Estado: {entity.mainState.ToUpper()}";

        capabilitiesText.text = BuildCapabilities(entity);

        GenerateActionButtons(entity);

        actionsLoadingContainer.SetActive(false);
    }


    private string BuildCapabilities(IoTEntity entity)
    {
        if (entity.capabilities == null ||
            entity.capabilities.Count == 0)
        {
            return "-";
        }

        return string.Join(
            "\n",
            entity.capabilities.Select(
                capability =>
                    $"• {BeautifyCapability(capability)}"
            )
        );
    }
    private void GenerateActionButtons(IoTEntity entity)
    {
        Debug.Log($"Generating buttons for {entity.name}");
        foreach (Transform child in actionsContainer)
        {
            Destroy(child.gameObject);
        }

        if (entity.actions == null)
        {
            return;
        }

        bool hasPowerActions = entity.actions.Contains("turn_on") && entity.actions.Contains("turn_off");

        if (hasPowerActions)
        {
            string powerAction = entity.mainState == "on" ? "turn_off" : "turn_on";

            ActionButton button = Instantiate(actionButtonPrefab, actionsContainer);

            button.Setup(BeautifyAction(powerAction), () =>
                {
                    ExecuteAction(entity.id, powerAction);
                }
            );
        }

        foreach (string action in entity.actions)
        {
            if (action == "turn_on" || action == "turn_off"){
                continue;
            }

            ActionButton button = Instantiate(actionButtonPrefab, actionsContainer);

            RectTransform rt = button.GetComponent<RectTransform>();

            button.Setup(BeautifyAction(action), () =>
                {
                    ExecuteAction(entity.id, action);
                }
            );
        }
    }
    private string BeautifyCapability(string capability)
    {
        return capability switch
        {
            "on_off" => "Encendido / Apagado",
            "volume" => "Volumen",
            "media_playback" => "Reproducción multimedia",
            "live_stream" => "Streaming en directo",
            "sensor" => "Sensorización",
            _ => capability.Replace("_", " ")
        };
    }

    private string BeautifyAction(string action)
    {
        return action switch
        {
            "turn_on" => "Encender",
            "turn_off" => "Apagar",
            "set_volume" => "Modificar volumen",
            "play" => "Reproducir",
            "pause" => "Pausar",
            "stop" => "Detener",
            "start_stream" => "Iniciar streaming",
            "stop_stream" => "Detener streaming",
            _ => action.Replace("_", " ")
        };
    }

    private void ExecuteAction(string entityId, string action)
    {
        actionsLoadingContainer.SetActive(true);

        apiClient.ExecuteAction(
            entityId,
            action,
            () =>
            {
                StartCoroutine(RefreshAfterDelay());
            }
        );
    }

    private IEnumerator RefreshAfterDelay()
    {
        yield return new WaitForSeconds(5f);

        deviceManager.RefreshSnapshot(() =>
        {
            deviceManager.ShowConfiguredDevices();

            actionsLoadingContainer.SetActive(false);
        });
    }

    private void ClosePanel()
    {
        gameObject.SetActive(false);
    }
}