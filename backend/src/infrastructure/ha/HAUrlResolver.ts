export function resolveHAUrl(inputUrl: string): string {
  let url = inputUrl.trim();
  
  if (url.startsWith("http://")) url = url.replace("http://", "ws://") + "/api/websocket";
  
  if (url.startsWith("https://")) url = url.replace("https://", "wss://") + "/api/websocket";
  
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) url = "ws://" + url + "/api/websocket";
  
  if (inputUrl.includes("homeassistant.local")) return "ws://homeassistant.local:8123/api/websocket";
  
  return url;
}
