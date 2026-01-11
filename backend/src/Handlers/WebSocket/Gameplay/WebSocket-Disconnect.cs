using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

namespace Handlers.WebSocket.Gameplay;

public class GameplayWebSocketDisconnect
{
    public APIGatewayProxyResponse GameplayWebSocketDisconnectHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = "Disconnected"
        };
    }
}