"use client";
import {
  OptimizelyProvider,
  ReactSDKClient,
  createInstance,
} from "@optimizely/react-sdk";
import { useEffect, useState } from "react";
import { Decision } from "@components/fx-test/decision";
import FlagsOffMessage from "@components/fx-test/flags-off-message";
import { Pre } from "@components/fx-test/pre";

const optimizelyClient: ReactSDKClient = createInstance({
  sdkKey: "WiCEtqymaemJWTqzgGZdu", // cms_integration_test
});

const userIds: string[] = [];
while (userIds.length < 4) {
  // to get rapid demo results, generate an array of random users. Each user always sees the same variation unless you reconfigure the flag rule.
  userIds.push((Math.floor(Math.random() * 999999) + 100000).toString());
}

function isClientValid() {
  const optimizelyConfig = optimizelyClient.getOptimizelyConfig();
  console.log("Optimizely Config:", optimizelyConfig);
  return optimizelyConfig !== null && optimizelyConfig !== undefined;
}

let userMessages = userIds.reduce((result, userId) => ({ ...result, [userId]: [] }), {});

const donePromise = new Promise<void>(resolve => {
  setTimeout(() => {
    optimizelyClient.onReady().then(() => {
      if (isClientValid()) {
        userIds.forEach(userId => {
          const question = `Tracking ${userId} with event cms-integration_test_event?`;
          const trackEvent = window.confirm(question);
          optimizelyClient.track('cms-integration_test_event', userId);
          const message = trackEvent
            ? 'Optimizely recorded a event cms-integration_test_event for user ' + userId
            : "Optimizely didn't record a event cms-integration_test_event for user " + userId;
          userMessages[userId].push(`${question} ${trackEvent ? 'Y' : 'N'}`, message);
        });
      }
      resolve();
    });
  }, 500);
});

interface FxProviderType {
  contents: any[];
}

export const FxProvider: React.FC<FxProviderType> = (props: FxProviderType) => {
  console.log("FxProvider props:", props);
  const [hasOnFlag, setHasOnFlag] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isClientReady, setIsClientReady] = useState<Boolean>(false);
  //const [projectId, setProjectId] = useState<string>();

  useEffect(() => {
    optimizelyClient.onReady().then(() => {
      console.log("Optimizely Client is ready");
      setIsDone(true);
      if (isClientValid()) {
        setIsClientReady(true);
       // setProjectID(optimizelyClient.getOptimizelyConfig());
      }
    }).catch((err) => {
      console.error("Error initializing Optimizely Client:", err);
      // Handle error
  });
  }, []);
  donePromise.then(() => setIsDone(true));
  optimizelyClient.onReady().then(() => {
    isClientValid() && setIsClientReady(true);
    console.log("Optimizely Client is ready");
  });

  let projectId = '{project_id}';
  if (isClientValid()) {
    const optimizelyConfig = optimizelyClient.getOptimizelyConfig();
    if (optimizelyConfig && typeof optimizelyConfig.getDatafile === "function") {
      try {
        const datafile = JSON.parse(optimizelyConfig.getDatafile());
        projectId = datafile.projectId || '{project_id}';
        console.log("Optimizely Datafile Project ID:", projectId);
      } catch (error) {
        console.error("Error parsing datafile:", error);
      }
    }
  }

  return (
    <OptimizelyProvider
      optimizely={optimizelyClient}
      // Generally React SDK runs for one client at a time i.e for one user throughout the lifecycle.
      // You can provide the user Id here once and the SDK will memoize and reuse it throughout the application lifecycle.
      // For this example, we are simulating 10 different users so we will ignore this and pass override User IDs to the useDecision hook for demonstration purpose.
      user={{ id: "default_user" }}
    >
      <pre>Welcome to our Quickstart Guide!</pre>
      {isClientReady && (
        <>
          {userIds.map((userId) => (
            <Decision
              key={userId}
              userId={userId}
              setHasOnFlag={setHasOnFlag}
              contents={props.contents}
            />
          ))}
          <br />
          {!hasOnFlag && projectId && <FlagsOffMessage projectId={projectId} />}
        </>
      )}
      {isDone && !isClientReady && (
        <Pre>
          Optimizely client invalid. Verify in Settings -{">"} Environments that
          you used the primary environment&lsquo;s SDK key
        </Pre>
      )}
    </OptimizelyProvider>
  );
}

export default FxProvider;
