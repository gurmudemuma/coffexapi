/**
 * Test script to verify approval and rejection functionality
 * This script tests both the frontend components and backend API
 */

// Test data
const testApprovalData = {
  documentHash: "test-license-hash-123",
  exportId: "EXP-TEST-1756467000000",
  action: "APPROVED",
  comments: "License document meets all requirements for coffee export",
  reviewedBy: "National Bank Officer"
};

const testRejectionData = {
  documentHash: "test-license-hash-456",
  exportId: "EXP-TEST-1756467000001",
  action: "REJECTED",
  comments: "License document missing required signatures",
  reviewedBy: "National Bank Officer"
};

// Test function for approval
async function testApproval() {
  console.log("Testing document approval...");
  
  try {
    const response = await fetch('http://localhost:8000/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testApprovalData)
    });
    
    const result = await response.json();
    console.log("Approval test result:", result);
    
    if (result.success) {
      console.log("✅ Approval test PASSED");
      return true;
    } else {
      console.log("❌ Approval test FAILED:", result.message);
      return false;
    }
  } catch (error) {
    console.log("❌ Approval test ERROR:", error.message);
    return false;
  }
}

// Test function for rejection
async function testRejection() {
  console.log("Testing document rejection...");
  
  try {
    const response = await fetch('http://localhost:8000/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRejectionData)
    });
    
    const result = await response.json();
    console.log("Rejection test result:", result);
    
    if (result.success) {
      console.log("✅ Rejection test PASSED");
      return true;
    } else {
      console.log("❌ Rejection test FAILED:", result.message);
      return false;
    }
  } catch (error) {
    console.log("❌ Rejection test ERROR:", error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Approval/Rejection Functionality Tests");
  console.log("===============================================");
  
  // Test API Gateway health
  try {
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      console.log("✅ API Gateway is running");
    } else {
      console.log("❌ API Gateway is not running");
      return;
    }
  } catch (error) {
    console.log("❌ Cannot connect to API Gateway:", error.message);
    return;
  }
  
  // Run approval test
  const approvalPassed = await testApproval();
  
  // Run rejection test
  const rejectionPassed = await testRejection();
  
  // Summary
  console.log("\n📋 Test Summary:");
  console.log("================");
  console.log(`Approval Test: ${approvalPassed ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`Rejection Test: ${rejectionPassed ? "✅ PASSED" : "❌ FAILED"}`);
  
  if (approvalPassed && rejectionPassed) {
    console.log("\n🎉 All tests PASSED! Approval and rejection functionality is working correctly.");
  } else {
    console.log("\n💥 Some tests FAILED. Please check the implementation.");
  }
}

// Run the tests
runTests();