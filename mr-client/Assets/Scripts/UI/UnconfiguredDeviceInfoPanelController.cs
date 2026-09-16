using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UnconfiguredDeviceInfoPanelController : MonoBehaviour
{
    [SerializeField]
    private TMP_Text titleText;

    [SerializeField]
    private Button fixDeviceButton;

    public Action OnFixRequested;

    public void Setup(UnconfiguredDevice device)
    {

        titleText.text = device.name;

        fixDeviceButton.onClick.RemoveAllListeners();

        fixDeviceButton.onClick.AddListener(() => { OnFixRequested?.Invoke(); });
    }
}