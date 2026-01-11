using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

namespace Handlers.WebSocket.Gameplay;

public class GameplayWebSocketDefault
{
    public APIGatewayProxyResponse GameplayWebSocketDefaultHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = "Default"
        };
    }
}