using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System;

public class ConfigurationPopupController : MonoBehaviour
{
    [SerializeField]
    private TextMeshProUGUI messageText;

    [SerializeField]
    private Button acceptButton;

    [SerializeField]
    private Button cancelButton;

    [SerializeField]
    private Button exitButton;

    private bool followCamera = false;

    public void Setup(int pendingDevices, Action onAccept, Action onCancel)
    {
        string message = pendingDevices == 1
            ? "Hay un dispositivo nuevo pendiente de configurar.\n\n¿Desea configurarlo ahora?"
            : $"Hay {pendingDevices} dispositivos nuevos pendientes de configurar.\n\n¿Desea configurarlos ahora?";

        messageText.text = message;

        acceptButton.onClick.RemoveAllListeners();
        cancelButton.onClick.RemoveAllListeners();
        exitButton.onClick.RemoveAllListeners();

        acceptButton.onClick.AddListener(() =>
        {
            onAccept?.Invoke();
        });

        cancelButton.onClick.AddListener(() =>
        {
            onCancel?.Invoke();
        });

        exitButton.onClick.AddListener(() =>
        {
            onCancel?.Invoke();
        });
    }

    void LateUpdate()
    {
        if (!followCamera)
        {
            return;
        }

        Camera cam = Camera.main;

        if (cam == null)
        {
            return;
        }

        SetPositionAndRotation(cam);
    }


    public void ShowInFrontOfCamera(){
        Camera cam = Camera.main;
        followCamera = true;

        if (cam == null) {
            return;
        }
        
        SetPositionAndRotation(cam);

        gameObject.SetActive(true);

    }

    public void StopFollowing()
    {
        followCamera = false;
    }

    private void SetPositionAndRotation(Camera camera)
    {

        transform.position = camera.transform.position + camera.transform.forward * 0.5f;

        transform.rotation = camera.transform.rotation * Quaternion.Euler(0f, 180f, 0f);

    }
}