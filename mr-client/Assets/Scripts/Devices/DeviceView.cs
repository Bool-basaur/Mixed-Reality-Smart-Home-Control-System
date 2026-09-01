using UnityEngine;
using TMPro;

public class DeviceView : MonoBehaviour
{
    public TextMeshProUGUI label;

    private IoTEntity entity;

    public void Setup(IoTEntity deviceEntity)
    {
        entity = deviceEntity;

        string capabilities =
            string.Join(
                ", ",
                entity.capabilities
            );

        string actions =
            string.Join(
                ", ",
                entity.actions
            );

        label.text =
            entity.name +
            "\n" +
            entity.category +
            "\n\nCaps: " +
            capabilities +
            "\n\nActions: " +
            actions;
    }
}