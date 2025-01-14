// ========= ID và ánh xạ User-Agent ========= //
const mapping = {
    "%E8%BD%A6%E7%A5%A8%E7%A5%A8": ["vip+watch_vip"],
    Locket: ["Gold"],
  };
  
  // ========= Phần thông báo cố định ========= //
  var ua = $request.headers["User-Agent"] || $request.headers["user-agent"],
    obj = JSON.parse($response.body);
  
  // Thông báo cho người dùng
  obj.Attention =
    "Chúc mừng bạn đã được nâng cấp lên Locket Gold! Vui lòng không chia sẻ mã script này cho người khác.";
  
  // ========= Thông tin đăng ký và quyền lợi ========= //
  var subscriptionDetails = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-31T23:59:59Z", // Ngày hết hạn giả lập
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2023-01-01T00:00:00Z",
    purchase_date: "2023-01-01T00:00:00Z",
    store: "app_store", // App Store hoặc Play Store
  };
  
  var entitlementDetails = {
    grace_period_expires_date: null,
    purchase_date: "2023-01-01T00:00:00Z",
    product_identifier: "com.locket.gold.yearly",
    expires_date: "2099-12-31T23:59:59Z",
  };
  
  // ========= Kiểm tra User-Agent và áp dụng ánh xạ ========= //
  const match = Object.keys(mapping).find((key) => ua.includes(key));
  
  if (match) {
    let [entitlementKey, subscriptionKey] = mapping[match];
    if (subscriptionKey) {
      // Ánh xạ subscription key và entitlement key
      entitlementDetails.product_identifier = subscriptionKey;
      obj.subscriber.subscriptions[subscriptionKey] = subscriptionDetails;
    } else {
      obj.subscriber.subscriptions["com.locket.gold.yearly"] = subscriptionDetails;
    }
    obj.subscriber.entitlements[entitlementKey] = entitlementDetails;
  } else {
    // Nếu không khớp User-Agent, sử dụng thông tin mặc định
    obj.subscriber.subscriptions["com.locket.gold.yearly"] = subscriptionDetails;
    obj.subscriber.entitlements.gold = entitlementDetails;
  }
  
  // Hoàn tất phản hồi
  $done({ body: JSON.stringify(obj) });
  