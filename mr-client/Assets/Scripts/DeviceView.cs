using UnityEngine;
using TMPro;
using System.Linq;

public class DeviceView : MonoBehaviour
{
    public TextMeshProUGUI label;

    private SpatialContext context;

    public void Setup(SpatialContext c){
        context = c;

        string capabilities = string.Join(", ",context.entity.capabilities);

        string actions = string.Join(", ", context.entity.actions);

        label.text = context.entity.name + "\n" + context.entity.category + "\n\nCaps: " + capabilities + "\n\nActions: " + actions;

        Debug.Log("[APP] Setup: " + context.entity.name);
    }

    public void OnClick()
    {
        Debug.Log("Clicked: " + context.entity.id);
    }
}