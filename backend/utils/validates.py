def validate_fields(data, required_fields):
    if not data:
        return {"error": "Request must be in JSON format."}
    missing = [field for field in required_fields if field not in data or data[field] is None]
    if missing:
        return {"error": f"Missing required field(s): {', '.join(missing)}"}
    return None
