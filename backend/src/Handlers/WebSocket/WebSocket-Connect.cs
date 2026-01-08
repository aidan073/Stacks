using Amazon.CDK;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

namespace Handlers.WebSocket;

public class WebSocketConnect
{
    public APIGatewayProxyResponse ConnectHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = "Connected"
        };
    }
}
