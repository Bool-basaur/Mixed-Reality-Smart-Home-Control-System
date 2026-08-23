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
    private TMP_Text actionsText;

    public void Setup(IoTEntity entity)
    {
        titleText.text = entity.name;

        stateText.text = $"Estado: {entity.mainState.ToUpper()}";

        capabilitiesText.text = BuildCapabilities(entity);

        actionsText.text = BuildActions(entity);
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

    private string BuildActions(IoTEntity entity)
    {
        if (entity.actions == null ||
            entity.actions.Count == 0)
        {
            return "-";
        }

        return string.Join(
            "\n",
            entity.actions.Select(
                action =>
                    $"• {BeautifyAction(action)}"
            )
        );
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