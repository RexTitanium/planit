import json
import os
import sys
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import HTTPException

from server.main import generate_response


def test_generate_response_success():
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.iter_lines.return_value = [b'{"response": "hello"}', b'{"response": " world"}']
    with patch('requests.post', return_value=mock_resp) as mock_post:
        result = generate_response('hi')
        mock_post.assert_called_once()
        assert result == 'hello world'


def test_generate_response_http_error():
    mock_resp = MagicMock()
    mock_resp.status_code = 500
    mock_resp.iter_lines.return_value = []
    with patch('requests.post', return_value=mock_resp):
        try:
            generate_response('bad')
        except HTTPException as e:
            assert e.status_code == 502
        else:
            assert False, 'HTTPException not raised'
