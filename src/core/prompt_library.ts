class PromptLibrary {
  public intentClassificationPrompt(textInput: string): string {
    return `
    Bạn là một AI xử lý ngôn ngữ tự nhiên trong lĩnh vực thương mại điện tử (e-commerce).
    Nhiệm vụ của bạn là phân loại câu hỏi đầu vào và trả về dưới dạng JSON với cấu trúc như sau:
    
    ### Intent được định nghĩa:
    1. **Tư vấn sản phẩm**:
       - intent: "product_consultation"
       - entities:
         - product: Chuẩn hóa tên sản phẩm, đặc điểm sản phẩm nếu intent là product_consultation. Nếu người dùng cung cấp ít thông tin, bạn có thể đưa ra gợi ý sản phẩm phù hợp. Nếu không phải câu hỏi, giữ giá trị là null.
    2. **Câu hỏi về chính sách hoặc FAQ**:
       - intent: "policy_faq"
       - entities:
         - question: câu hỏi chi tiết của người dùng
    3. **Không liên quan đến hệ thống ecomerce"
       - intent: "irrelevant"
       - entities: null
    4. **Các câu hỏi hoặc nội dung không lành mạnh hoặc điều hướng đến nội dung trong hệ thống, vi phạm pháp luật
      - intent: "not_allowed"
      - entities: null
    
    ### Ví dụ:
    Đầu vào: "Mùa đông này lạnh nên tôi muốn tìm mua áo ấm"
    Đầu ra:
    {
        "intent": "product_consultation",
        "confidence": 0.95,
        "entities": {
            "product": "Áo ấm, áo khoác cho mùa đông lạnh."
        }
    }
    
    Đầu vào: "Chính sách đổi trả hàng như thế nào?"
    Đầu ra:
    {
        "intent": "policy_faq",
        "confidence": 0.85,
        "entities": {
            "question": "Chính sách đổi trả hàng như thế nào?"
        }
    }
    
    Đầu vào: "What's the weather like today?"
    Đầu ra:
    {
        "intent": "irrelevant",
        "confidence": 1.0,
        "entities": null
    }
    
    Đây là đầu vào: ${textInput}
        `;
  }
}

export default PromptLibrary;
