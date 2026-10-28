from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase

from apps.resumes.services import process_resume_file


class ProcessResumeFileTests(SimpleTestCase):
    @patch('apps.resumes.services.embedder')
    @patch('apps.resumes.services.extract_skills', return_value=[' Python ', 'PYTHON'])
    @patch('apps.resumes.services.parse_pdf', return_value='Resume text')
    def test_returns_fields_accepted_by_resume_model(
        self,
        parse_pdf,
        extract_skills,
        embedder,
    ):
        embedder.encode.return_value.tolist.return_value = [0.0] * 384

        result = process_resume_file(SimpleNamespace(name='resume.pdf'))

        self.assertEqual(
            set(result),
            {'raw_text', 'extracted_skills', 'embeddings', 'embedding_version'},
        )
        self.assertEqual(result['raw_text'], 'Resume text')
        self.assertEqual(result['extracted_skills'], ['python'])
        self.assertEqual(len(result['embeddings']), 384)
        self.assertEqual(result['embedding_version'], 'all-MiniLM-L6-v2')
        parse_pdf.assert_called_once()
        extract_skills.assert_called_once_with('Resume text')
        embedder.encode.assert_called_once_with('Resume text')
