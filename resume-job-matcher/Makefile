.PHONY: backend frontend test

backend:
	cd backend && python manage.py runserver

frontend:
	cd frontend && npm run dev

test:
	cd backend && python manage.py test
	cd frontend && npm run build
