using UnityEngine;
using UnityEngine.EventSystems;

public class ButtonHoverEffect : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler, IPointerDownHandler, IPointerUpHandler {

    private Vector3 originalScale;

    private void Awake()
    {
        originalScale = transform.localScale;
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        Debug.Log("[APP] ENTER " + gameObject.name);
        transform.localScale = originalScale * 1.05f;
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        Debug.Log("[APP] EXIT " + gameObject.name);
        transform.localScale = originalScale;
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        transform.localScale = originalScale * 0.95f;
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        transform.localScale = originalScale * 1.05f;
    }
}