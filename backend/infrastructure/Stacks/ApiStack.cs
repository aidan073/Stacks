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
    public ApiStack(Construct scope, string id, StackProps props)
        : base(scope, id, props)
    {
        // ==== Gameplay WebSocket and EndPoints ====
        WebSocketApi gameplayWebSocketApi = new WebSocketApi(this, "GameplayWebSocketApi");

        new WebSocketStage(this, "GameplayDevStage", new WebSocketStageProps
        {
            WebSocketApi = gameplayWebSocketApi,
            StageName = "dev",
            AutoDeploy = true
        });

        new CfnOutput(this, "GameplayWebSocketApiId", new CfnOutputProps
        {
            Value = gameplayWebSocketApi.ApiId
        });
        new CfnOutput(this, "GameplayWebSocketApiEndpoint", new CfnOutputProps
        {
            Value = gameplayWebSocketApi.ApiEndpoint
        });

        var gameplayWebSocketConnectHandler = new Function(this, "GameplayWebSocketConnectLambda", SharedLambdaProps("GameplayWebSocketConnectHandler"));
        gameplayWebSocketApi.AddRoute("$connect", new WebSocketRouteProps
        {
            Integration = new WebSocketLambdaIntegration("GameplayWebSocketConnectIntegration", gameplayWebSocketConnectHandler)
        });

        var gameplayWebSocketDisconnectHandler = new Function(this, "GameplayWebSocketDisconnectLambda", SharedLambdaProps("GameplayWebSocketDisconnectHandler"));
        gameplayWebSocketApi.AddRoute("$disconnect", new WebSocketRouteProps
        {
            Integration = new WebSocketLambdaIntegration("GameplayWebSocketDisconnectIntegration", gameplayWebSocketDisconnectHandler)
        });

        var gameplayWebSocketDefaultHandler = new Function(this, "GameplayWebSocketDefaultLambda", SharedLambdaProps("GameplayWebSocketDefaultHandler"));
        gameplayWebSocketApi.AddRoute("$default", new WebSocketRouteProps
        {
            Integration = new WebSocketLambdaIntegration("GameplayWebSocketDefaultIntegration", gameplayWebSocketDefaultHandler)
        });

        // ====   ====
    }
}