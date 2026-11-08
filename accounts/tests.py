
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User=get_user_model()


class RegisterTests(APITestCase):
    def setUp(self):
        self.url=reverse("register")
        self.valid_data={"username": "testuser", "email": "test@example.com", "password": "strongpass123"}

    def test_register_successfully(self):
        response=self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["username"], "testuser")
        self.assertEqual(response.data["user"]["email"], "test@example.com")
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_password_is_hashed(self):
        self.client.post(self.url, self.valid_data)

        user=User.objects.get(username="testuser")

        self.assertNotEqual(user.password, self.valid_data["password"])
        self.assertTrue(user.check_password(self.valid_data["password"]))

    def test_register_with_existing_username(self):
        User.objects.create_user(username="testuser", email="existing@example.com", password="strongpass123")

        response=self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_register_with_existing_email(self):
        User.objects.create_user(username="existinguser", email="test@example.com", password="strongpass123")

        response=self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_with_email_different_case(self):
        User.objects.create_user(username="existinguser", email="test@example.com", password="strongpass123")

        data={**self.valid_data, "email": "TEST@EXAMPLE.COM"}

        response=self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_with_invalid_email(self):
        data={**self.valid_data, "email": "invalid-email"}

        response=self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_without_email(self):
        data=self.valid_data.copy()
        data.pop("email")

        response=self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_with_short_password(self):
        data={**self.valid_data,"password": "short"}

        response=self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user=User.objects.create_user(username="testuser", email="test@example.com", password="strongpass123")

        self.login_url=reverse("login")
        self.refresh_url=reverse("token-refresh")
        self.me_url=reverse("me")

    def test_login_successfully(self):
        response=self.client.post(self.login_url, {"username": "testuser", "password": "strongpass123"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_wrong_password(self):
        response=self.client.post(self.login_url, {"username": "testuser", "password": "wrongpassword"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_nonexistent_user(self):
        response=self.client.post(self.login_url, {"username": "unknownuser", "password": "strongpass123"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_successfully(self):
        login_response=self.client.post(self.login_url, {"username": "testuser", "password": "strongpass123"})

        refresh_response=self.client.post(self.refresh_url, {"refresh": login_response.data["refresh"]})

        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)

    def test_me_without_authentication(self):
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_with_authentication(self):
        login_response=self.client.post(self.login_url, {"username": "testuser", "password": "strongpass123"})

        access_token=login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response=self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["email"], self.user.email)
