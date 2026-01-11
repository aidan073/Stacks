using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

namespace Handlers.WebSocket.Gameplay;

public class GameplayWebSocketConnect
{
    public APIGatewayProxyResponse GameplayWebSocketConnectHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = "Connected"
        };
    }
}
