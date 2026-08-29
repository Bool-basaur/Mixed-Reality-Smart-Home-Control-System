using System.Linq;
using TMPro;
using UnityEngine;

public class DeviceInfoPanelController : MonoBehaviour
{
    [SerializeField]
    private TMP_Text titleText;

    [SerializeField]
    private TMP_Text stateText;

    [SerializeField]
    private TMP_Text capabilitiesText;

    [SerializeField]
    private Transform actionsContainer;

    [SerializeField]
    private ActionButton actionButtonPrefab;

    public void Setup(IoTEntity entity)
    {
        titleText.text = entity.name;

        stateText.text = $"Estado: {entity.mainState.ToUpper()}";

        capabilitiesText.text = BuildCapabilities(entity);

        GenerateActionButtons(entity);
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

            button.Setup(
                BeautifyAction(powerAction),
                () =>
                {
                    Debug.Log(
                        $"Execute {powerAction}"
                    );
                }
            );
        }

        foreach (string action in entity.actions)
        {
            if (action == "turn_on" || action == "turn_off"){
                continue;
            }

            ActionButton button = Instantiate(actionButtonPrefab, actionsContainer);

            //Debug.Log($"Creating button for {action}");
            RectTransform rt = button.GetComponent<RectTransform>();

            /*Debug.Log(
                $"Button: {button.name}" +
                $"\nLocalPos: {rt.localPosition}" +
                $"\nAnchoredPos: {rt.anchoredPosition}" +
                $"\nSize: {rt.sizeDelta}" +
                $"\nScale: {rt.localScale}"
            ); 
            Debug.Log($"Container children: {actionsContainer.childCount}");
            Debug.Log($"Parent: {button.transform.parent.name}");
            Debug.Log($"World pos: {button.transform.position}");*/

            button.Setup(BeautifyAction(action),  () =>
                {
                    Debug.Log(
                        $"Execute {action}"
                    );
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
}