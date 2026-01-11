using Amazon.CDK;

namespace Infrastructure.Stacks;

sealed class Program
{
    public static void Main(string[] args)
    {
        var app = new App();
        new ApiStack(app, "ApiStack", new StackProps
        {

        });
        app.Synth();
    }
}