using Amazon.CDK;
using Constructs;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.Apigatewayv2;
using Amazon.CDK.AwsApigatewayv2Integrations;

namespace Infrastructure.Stacks;

public class ApiStack : Stack
{

    private FunctionProps SharedLambdaProps(string funcName) => new FunctionProps
    {
        Runtime = Runtime.DOTNET_9,
        Handler = $"backend::Handlers.WebSocket.WebSocketConnect::{funcName}",
        Code = Code.FromAsset("../src/bin/Debug/net9.0")
    };
    // TODO: Come up with a more structured naming scheme
    public ApiStack(Construct scope, string id, StackProps props)
        : base(scope, id, props)
    {
        // Gameplay WebSocket
        WebSocketApi webSocketApi = new WebSocketApi(this, "GameplayWebSocketApi");

        new WebSocketStage(this, "GameplayDevStage", new WebSocketStageProps
        {
            WebSocketApi = webSocketApi,
            StageName = "dev",
            AutoDeploy = true
        });

        new CfnOutput(this, "GameplayWebSocketApiId", new CfnOutputProps
        {
            Value = webSocketApi.ApiId
        });
        new CfnOutput(this, "GameplayWebSocketApiEndpoint", new CfnOutputProps
        {
            Value = webSocketApi.ApiEndpoint
        });

        var connectionHandler = new Function(this, "GameplayConnectionHandlerLambda", SharedLambdaProps("ConnectHandler"));

        webSocketApi.AddRoute("$connect", new WebSocketRouteProps {
                Integration = new WebSocketLambdaIntegration("GameplayConnectIntegration", connectionHandler)
            });
        }
}