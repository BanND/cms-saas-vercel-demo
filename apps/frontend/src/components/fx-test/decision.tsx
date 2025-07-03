import { useDecision } from "@optimizely/react-sdk";
import Pre from "./pre";

interface DecisionType {
  userId: string;
  setHasOnFlag: Function;
  contents: any[];
}

export const Decision: React.FC<DecisionType> = (props: DecisionType) => {
  const { userId, setHasOnFlag, contents } = props;

  // Generally React SDK runs for one client at a time i.e for one user throughout the lifecycle.
  // You can provide the user Id once while wrapping the app in the Provider component and the SDK will memoize and reuse it throughout the application lifecycle.
  // For this example, we are simulating 10 different users so we will ignore this and pass override User IDs to the useDecision hook for demonstration purpose.
  // This override will not be needed for normal react sdk use cases.
  const [decision, clientReady] = useDecision(
    "cms_integration_test",
    {},
    { overrideUserId: userId },
  );

  // Don't render the component if SDK client is not ready yet.
  if (!clientReady) {
    return "";
  }

  const variationKey = decision.variationKey;

  // did decision fail with a critical error?
  if (variationKey === null) {
    console.log(" decision error: ", decision["reasons"]);
  }

  if (decision.enabled) {
    setTimeout(() => setHasOnFlag(true));
  }

  // get a dynamic configuration variable
  // "sort_method" corresponds to a variable key in your Optimizely project
  const sortMethod = decision.variables["cms-integration-test-method"];
  const cmsVariationName =
    decision.variables["cms-integration-test-variation-name"] || null;
  const content = contents.find(
    (content) => content._metadata.variation == cmsVariationName,
  );

  return (
    <>
      <Pre>
        {`\nFlag ${
          decision.enabled ? "on" : "off"
        }. User number ${userId} saw flag variation: ${variationKey} and got event cms-integration_test_event
 : ${sortMethod} config variable as part of flag rule: ${decision.ruleKey}`}
      </Pre>

      {!!content && (
        <div>
          <p>---------------------------------</p>
          <p>
            Name: {content._metadata.displayName} <br />
            Variation: {content._metadata.variation || "Original"} <br />
          </p>
          <p>
            SEO Settings:{" "}
            {content.BlankExperienceSeoSettings?.MetaTitle || "No Title"} <br />
          </p>
          <p>
            Heading Text:{" "}
            {
              content.composition.nodes[0]?.nodes[0]?.nodes[0]?.nodes[0]
                ?.component?.headingText
            }{" "}
            <br />
          </p>
          <p>---------------------------------</p>
        </div>
      )}
    </>
  );
};
