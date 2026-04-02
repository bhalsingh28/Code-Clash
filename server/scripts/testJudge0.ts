import "dotenv/config";

async function testJudge0() {
  const protocol = process.env.JUDGE0_PROTOCOL || "https";
  const host = process.env.JUDGE0_HOST;
  const port = process.env.JUDGE0_PORT ? `:${process.env.JUDGE0_PORT}` : "";
  const apiKey = process.env.JUDGE0_API_KEY;

  const baseUrl = `${protocol}://${host}${port}`;
  const hasAuth = apiKey && apiKey.trim().length > 0;

  console.log("🚀 Testing Judge0 Integration...\n");
  console.log(`📡 Judge0 URL: ${baseUrl}`);
  console.log(`🔑 Authentication: ${hasAuth ? "Yes (RapidAPI)" : "No"}\n`);

  // Simple C++ code: sum of two numbers
  const testCode = `
class Solution {
public:
    int add(int a, int b) {
        return a + b;
    }
};
`;

  const fullCode = `
#include <bits/stdc++.h>
using namespace std;

${testCode}

int main() {
    Solution sol;
    cout << sol.add(5, 3) << endl;
    return 0;
}
`;

  try {
    console.log("📤 Submitting code to Judge0...");

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (hasAuth) {
      headers["x-rapidapi-key"] = apiKey;
      headers["x-rapidapi-host"] = host;
    }

    const response = await fetch(
      `${baseUrl}/submissions?base64_encoded=true&wait=false`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          language_id: 54, // C++
          source_code: fullCode,
          stdin: "",
          expected_output: "8\n",
        }),
      },
    );

    console.log("Response status:", response.status);
    const submission = (await response.json()) as any;
    console.log("📋 Submission response:", JSON.stringify(submission, null, 2));

    if (!submission.token) {
      console.error("❌ Failed to get token");
      if (submission.message)
        console.error("Error message:", submission.message);
      return;
    }

    console.log("✅ Submission received, token:", submission.token);

    // Poll for result
    let result: any;
    for (let i = 0; i < 50; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const resultResponse = await fetch(
        `${baseUrl}/submissions/${submission.token}?base64_encoded=true`,
        {
          headers: hasAuth
            ? {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": host,
              }
            : {},
        },
      );

      result = (await resultResponse.json()) as any;

      // Decode base64 fields if present
      if (result.stdout)
        result.stdout = Buffer.from(result.stdout, "base64").toString();
      if (result.stderr)
        result.stderr = Buffer.from(result.stderr, "base64").toString();
      if (result.compile_output)
        result.compile_output = Buffer.from(
          result.compile_output,
          "base64",
        ).toString();

      if (!result.status) {
        console.log(`⏳ Attempt ${i + 1}: Waiting...`);
      } else {
        console.log(
          `⏳ Attempt ${i + 1}: Status = ${result.status?.description} (${
            result.status?.id
          })`,
        );
      }

      if (result.status && result.status.id > 2) {
        break;
      }
    }

    console.log("\n📊 FINAL RESULT:");
    console.log(`Status: ${result.status?.description || "NOT RECEIVED"}`);
    console.log(`Output: "${(result.stdout || "").trim()}"`);
    console.log(`Expected: "8"`);
    console.log(`\nFull response:`, JSON.stringify(result, null, 2));

    if (result.status?.id === 3) {
      console.log("\n✅ Judge0 is working correctly!");
    } else {
      console.log("\n❌ Test failed");
    }
  } catch (error) {
    console.error("❌ Error:", (error as any).message);
    console.error("Stack:", (error as any).stack);
  }
}

testJudge0();
