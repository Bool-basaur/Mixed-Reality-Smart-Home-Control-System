using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System;

public class ActionButton : MonoBehaviour
{
    [SerializeField]
    private Button button;

    [SerializeField]
    private TMP_Text label;

    public void Setup(string text, Action onClick){
        label.text = text;

        button.onClick.RemoveAllListeners();

        button.onClick.AddListener(
            () => onClick?.Invoke()
        );
    }
}