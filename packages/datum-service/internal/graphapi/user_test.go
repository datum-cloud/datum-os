package graphapi_test

import (
	"testing"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/datum-cloud/datum-os/pkg/entx"
	mock_fga "github.com/datum-cloud/datum-os/pkg/fgax/mockery"
	"github.com/samber/lo"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	ent "github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/graphapi"
	auth "github.com/datum-cloud/datum-os/pkg/auth"
	"github.com/datum-cloud/datum-os/pkg/datumclient"
)

func (suite *GraphTestSuite) TestQueryUser() {
	t := suite.T()

	// setup user context
	ctx, err := userContext()
	require.NoError(t, err)

	user1 := (&UserBuilder{client: suite.client}).MustNew(ctx, t)
	user2 := (&UserBuilder{client: suite.client}).MustNew(ctx, t)

	// setup valid user context
	reqCtx, err := auth.NewTestContextWithOrgID(user1.ID, user1.Edges.Setting.Edges.DefaultOrg.ID)
	require.NoError(t, err)

	testCases := []struct {
		name     string
		queryID  string
		expected *ent.User
		errorMsg string
	}{
		{
			name:     "happy path user",
			queryID:  user1.ID,
			expected: user1,
		},
		{
			name:     "valid user, but no auth",
			queryID:  user2.ID,
			errorMsg: "user not found",
		},
		{
			name:     "invalid-id",
			queryID:  "tacos-for-dinner",
			errorMsg: "user not found",
		},
	}

	for _, tc := range testCases {
		t.Run("Get "+tc.name, func(t *testing.T) {
			defer mock_fga.ClearMocks(suite.client.fga)

			if tc.errorMsg == "" {
				// mock check calls
				mock_fga.CheckAny(t, suite.client.fga, true)
			}

			resp, err := suite.client.datum.GetUserByID(reqCtx, tc.queryID)

			if tc.errorMsg != "" {
				require.Error(t, err)
				assert.ErrorContains(t, err, tc.errorMsg)
				assert.Nil(t, resp)

				return
			}

			require.NoError(t, err)
			require.NotNil(t, resp)
			require.NotNil(t, resp.User)
		})
	}

	(&UserCleanup{client: suite.client, ID: user1.ID}).MustDelete(reqCtx, t)
	(&UserCleanup{client: suite.client, ID: user2.ID}).MustDelete(reqCtx, t)
}

func (suite *GraphTestSuite) TestQueryUsers() {
	t := suite.T()

	// setup user context
	reqCtx, err := userContext()
	require.NoError(t, err)

	user1 := (&UserBuilder{client: suite.client}).MustNew(reqCtx, t)
	user2 := (&UserBuilder{client: suite.client}).MustNew(reqCtx, t)

	t.Run("Get Users", func(t *testing.T) {
		defer mock_fga.ClearMocks(suite.client.fga)

		resp, err := suite.client.datum.GetAllUsers(reqCtx)

		require.NoError(t, err)
		require.NotNil(t, resp)
		require.NotNil(t, resp.Users.Edges)

		// make sure only the current user is returned
		assert.Equal(t, len(resp.Users.Edges), 1)

		// setup valid user context
		reqCtx, err := userContextWithID(user1.ID)
		require.NoError(t, err)

		resp, err = suite.client.datum.GetAllUsers(reqCtx)

		require.NoError(t, err)
		require.NotNil(t, resp)
		require.NotNil(t, resp.Users.Edges)

		// only user that is making the request should be returned
		assert.Equal(t, len(resp.Users.Edges), 1)

		user1Found := false
		user2Found := false

		for _, o := range resp.Users.Edges {
			if o.Node.ID == user1.ID {
				user1Found = true
			} else if o.Node.ID == user2.ID {
				user2Found = true
			}
		}

		// only user 1 should be found
		if !user1Found {
			t.Errorf("user 1 was expected to be found but was not")
		}

		// user 2 should not be found
		if user2Found {
			t.Errorf("user 2 was not expected to be found but was returned")
		}
	})
}

// func (suite *GraphTestSuite) TestMutationCreateUserNoAuth() {
// 	t := suite.T()

// 	// setup user context
// 	reqCtx, err := userContext()
// 	require.NoError(t, err)

// 	// Bypass auth checks to ensure input checks for now
// 	reqCtx = privacy.DecisionContext(reqCtx, privacy.Allow)

// 	weakPassword := "notsecure"
// 	strongPassword := "my&supers3cr3tpassw0rd!"

// 	email := gofakeit.Email()

// 	testCases := []struct {
// 		name      string
// 		userInput datumclient.CreateUserInput
// 		errorMsg  string
// 	}{
// 		{
// 			name: "happy path user",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:    lo.ToPtr(gofakeit.FirstName()),
// 				LastName:     lo.ToPtr(gofakeit.LastName()),
// 				DisplayName:  gofakeit.LetterN(50),
// 				Email:        email,
// 				AuthProvider: &enums.AuthProviderCredentials,
// 				Password:     &strongPassword,
// 			},
// 			errorMsg: "",
// 		},
// 		{
// 			name: "same email, same auth provider",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:    lo.ToPtr(gofakeit.FirstName()),
// 				LastName:     lo.ToPtr(gofakeit.LastName()),
// 				DisplayName:  gofakeit.LetterN(50),
// 				Email:        email,
// 				AuthProvider: &enums.AuthProviderCredentials,
// 				Password:     &strongPassword,
// 			},
// 			errorMsg: "constraint failed",
// 		},
// 		{
// 			name: "same email, different auth provider",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:    lo.ToPtr(gofakeit.FirstName()),
// 				LastName:     lo.ToPtr(gofakeit.LastName()),
// 				DisplayName:  gofakeit.LetterN(50),
// 				Email:        email,
// 				AuthProvider: &enums.AuthProviderGitHub,
// 			},
// 			errorMsg: "",
// 		},
// 		{
// 			name: "no email",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:   lo.ToPtr(gofakeit.FirstName()),
// 				LastName:    lo.ToPtr(gofakeit.LastName()),
// 				DisplayName: gofakeit.LetterN(50),
// 				Email:       "",
// 			},
// 			errorMsg: "mail: no address",
// 		},
// 		{
// 			name: "no first name",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:   lo.ToPtr(""),
// 				LastName:    lo.ToPtr(gofakeit.LastName()),
// 				DisplayName: gofakeit.LetterN(50),
// 				Email:       gofakeit.Email(),
// 			},
// 			errorMsg: "",
// 		},
// 		{
// 			name: "no last name",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName:   lo.ToPtr(gofakeit.FirstName()),
// 				LastName:    lo.ToPtr(""),
// 				DisplayName: gofakeit.LetterN(50),
// 				Email:       gofakeit.Email(),
// 			},
// 			errorMsg: "",
// 		},
// 		{
// 			name: "no display name, should default to email",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName: lo.ToPtr(gofakeit.FirstName()),
// 				LastName:  lo.ToPtr(gofakeit.LastName()),
// 				Email:     gofakeit.Email(),
// 			},
// 			errorMsg: "",
// 		},
// 		{
// 			name: "weak password",
// 			userInput: datumclient.CreateUserInput{
// 				FirstName: lo.ToPtr(gofakeit.FirstName()),
// 				LastName:  lo.ToPtr(gofakeit.LastName()),
// 				Email:     gofakeit.Email(),
// 				Password:  &weakPassword,
// 			},
// 			errorMsg: auth.ErrPasswordTooWeak.Error(),
// 		},
// 	}

// 	for _, tc := range testCases {
// 		t.Run("Create "+tc.name, func(t *testing.T) {
// 			defer mock_fga.ClearMocks(suite.client.fga)

// 			if tc.errorMsg == "" {
// 				mock_fga.CheckAny(t, suite.client.fga, true)

// 				// mock writes to create personal org membership
// 				mock_fga.WriteAny(t, suite.client.fga)
// 			}

// 			resp, err := suite.client.datum.CreateUser(reqCtx, tc.userInput)

// 			if tc.errorMsg != "" {
// 				require.Error(t, err)
// 				assert.ErrorContains(t, err, tc.errorMsg)
// 				assert.Nil(t, resp)

// 				return
// 			}

// 			require.NoError(t, err)
// 			require.NotNil(t, resp)
// 			require.NotNil(t, resp.CreateUser.User)

// 			// Make sure provided values match
// 			assert.Equal(t, tc.userInput.FirstName, resp.CreateUser.User.FirstName)
// 			assert.Equal(t, tc.userInput.LastName, resp.CreateUser.User.LastName)
// 			assert.Equal(t, tc.userInput.Email, resp.CreateUser.User.Email)

// 			if tc.userInput.AuthProvider != nil {
// 				assert.Equal(t, tc.userInput.AuthProvider, &resp.CreateUser.User.AuthProvider)
// 			} else {
// 				// default is credentials if not provided
// 				assert.Equal(t, enums.AuthProviderCredentials, resp.CreateUser.User.AuthProvider)
// 			}
// 			// display name defaults to email if not provided
// 			if tc.userInput.DisplayName == "" {
// 				expectedDisplayName := strings.Split(tc.userInput.Email, "@")[0]
// 				assert.Equal(t, expectedDisplayName, resp.CreateUser.User.DisplayName)
// 			} else {
// 				assert.Equal(t, tc.userInput.DisplayName, resp.CreateUser.User.DisplayName)
// 			}

// 			// subject should always be set
// 			assert.Equal(t, resp.CreateUser.User.ID, *resp.CreateUser.User.Sub)

// 			// ensure a user setting was created
// 			assert.NotNil(t, resp.CreateUser.User.Setting)

// 			orgs := resp.CreateUser.User.OrgMemberships
// 			require.Len(t, orgs, 1)

// 			// set user context
// 			userCtx, err := auth.NewTestContextWithOrgID(resp.CreateUser.User.ID, orgs[0].OrganizationID)
// 			require.NoError(t, err)

// 			// mocks to check for org access
// 			listObjects := []string{fmt.Sprintf("organization:%s", orgs[0].OrganizationID)}
// 			mock_fga.ListAny(t, suite.client.fga, listObjects)

// 			// Bypass auth checks to ensure input checks for now
// 			personalOrg, err := suite.client.datum.GetOrganizationByID(userCtx, orgs[0].OrganizationID)
// 			require.NoError(t, err)

// 			assert.True(t, *personalOrg.Organization.PersonalOrg)
// 			// make sure there is only one user
// 			require.Len(t, personalOrg.Organization.Members, 1)
// 			// make sure user was added as owner
// 			assert.Equal(t, personalOrg.Organization.Members[0].Role.String(), "OWNER")
// 		})
// 	}
// }

func (suite *GraphTestSuite) TestMutationCreateUser() {
	t := suite.T()

	// setup user context
	reqCtx, err := userContext()
	require.NoError(t, err)

	// weakPassword := "notsecure"
	strongPassword := "my&supers3cr3tpassw0rd!"

	testCases := []struct {
		name      string
		userInput datumclient.CreateUserInput
		errorMsg  string
	}{
		{
			name: "no auth create user",
			userInput: datumclient.CreateUserInput{
				FirstName:   lo.ToPtr(gofakeit.FirstName()),
				LastName:    lo.ToPtr(gofakeit.LastName()),
				DisplayName: gofakeit.LetterN(50),
				Email:       gofakeit.Email(),
				Password:    &strongPassword,
			},
			errorMsg: graphapi.ErrPermissionDenied.Error(),
		},
		// TODO: These will all have no-auth failures
		// until a policy is added to add service user concepts
		// users should generally be created via register or invite, and not
		// the create user graph api
		// {
		// 	name: "happy path user",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName:   gofakeit.FirstName(),
		// 		LastName:    gofakeit.LastName(),
		// 		DisplayName: gofakeit.LetterN(50),
		// 		Email:       gofakeit.Email(),
		// 		Password:    &strongPassword,
		// 	},
		// 	errorMsg: "",
		// },
		// {
		// 	name: "no email",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName:   gofakeit.FirstName(),
		// 		LastName:    gofakeit.LastName(),
		// 		DisplayName: gofakeit.LetterN(50),
		// 		Email:       "",
		// 	},
		// 	errorMsg: "mail: no address",
		// },
		// {
		// 	name: "no first name",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName:   "",
		// 		LastName:    gofakeit.LastName(),
		// 		DisplayName: gofakeit.LetterN(50),
		// 		Email:       gofakeit.Email(),
		// 	},
		// 	errorMsg: "value is less than the required length",
		// },
		// {
		// 	name: "no last name",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName:   gofakeit.FirstName(),
		// 		LastName:    "",
		// 		DisplayName: gofakeit.LetterN(50),
		// 		Email:       gofakeit.Email(),
		// 	},
		// 	errorMsg: "value is less than the required length",
		// },
		// {
		// 	name: "no display name, should default to email",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName: gofakeit.FirstName(),
		// 		LastName:  gofakeit.LastName(),
		// 		Email:     gofakeit.Email(),
		// 	},
		// 	errorMsg: "",
		// },
		// {
		// 	name: "weak password",
		// 	userInput: datumclient.CreateUserInput{
		// 		FirstName: gofakeit.FirstName(),
		// 		LastName:  gofakeit.LastName(),
		// 		Email:     gofakeit.Email(),
		// 		Password:  &weakPassword,
		// 	},
		// 	errorMsg: auth.ErrPasswordTooWeak.Error(),
		// },
	}

	for _, tc := range testCases {
		t.Run("Create "+tc.name, func(t *testing.T) {
			defer mock_fga.ClearMocks(suite.client.fga)

			if tc.errorMsg == "" {
				// mock writes to create personal org membership
				mock_fga.WriteAny(t, suite.client.fga)
			}

			resp, err := suite.client.datum.CreateUser(reqCtx, tc.userInput)

			if tc.errorMsg != "" {
				require.Error(t, err)
				assert.ErrorContains(t, err, tc.errorMsg)
				assert.Nil(t, resp)

				return
			}

			require.NoError(t, err)
			require.NotNil(t, resp)
			require.NotNil(t, resp.CreateUser.User)

			// Make sure provided values match
			assert.Equal(t, tc.userInput.FirstName, resp.CreateUser.User.FirstName)
			assert.Equal(t, tc.userInput.LastName, resp.CreateUser.User.LastName)
			assert.Equal(t, tc.userInput.Email, resp.CreateUser.User.Email)

			// display name defaults to email if not provided
			if tc.userInput.DisplayName == "" {
				assert.Equal(t, tc.userInput.Email, resp.CreateUser.User.DisplayName)
			} else {
				assert.Equal(t, tc.userInput.DisplayName, resp.CreateUser.User.DisplayName)
			}

			// ensure a user setting was created
			assert.NotNil(t, resp.CreateUser.User.Setting)

			// ensure personal org is created
			// default org will always be the personal org when the user is first created
			personalOrgID := resp.CreateUser.User.Setting.DefaultOrg.ID

			org, err := suite.client.datum.GetOrganizationByID(reqCtx, personalOrgID, nil)
			require.NoError(t, err)
			assert.Equal(t, personalOrgID, org.Organization.ID)
			assert.True(t, *org.Organization.PersonalOrg)
		})
	}
}

func (suite *GraphTestSuite) TestMutationUpdateUser() {
	t := suite.T()

	// setup user context
	ctx, err := userContext()
	require.NoError(t, err)

	firstNameUpdate := gofakeit.FirstName()
	lastNameUpdate := gofakeit.LastName()
	emailUpdate := gofakeit.Email()
	displayNameUpdate := gofakeit.LetterN(40)
	nameUpdateLong := gofakeit.LetterN(200)

	user := (&UserBuilder{client: suite.client}).MustNew(ctx, t)

	// setup valid user context
	reqCtx, err := auth.NewTestContextWithOrgID(user.ID, user.Edges.Setting.Edges.DefaultOrg.ID)
	require.NoError(t, err)

	weakPassword := "notsecure"

	testCases := []struct {
		name        string
		updateInput datumclient.UpdateUserInput
		expectedRes datumclient.UpdateUser_UpdateUser_User
		errorMsg    string
	}{
		{
			name: "update first name and password, happy path",
			updateInput: datumclient.UpdateUserInput{
				FirstName: &firstNameUpdate,
			},
			expectedRes: datumclient.UpdateUser_UpdateUser_User{
				ID:          user.ID,
				FirstName:   &firstNameUpdate,
				LastName:    &user.LastName,
				DisplayName: user.DisplayName,
				Email:       user.Email,
			},
		},
		{
			name: "update last name, happy path",
			updateInput: datumclient.UpdateUserInput{
				LastName: &lastNameUpdate,
			},
			expectedRes: datumclient.UpdateUser_UpdateUser_User{
				ID:          user.ID,
				FirstName:   &firstNameUpdate, // this would have been updated on the prior test
				LastName:    &lastNameUpdate,
				DisplayName: user.DisplayName,
				Email:       user.Email,
			},
		},
		{
			name: "update email, happy path",
			updateInput: datumclient.UpdateUserInput{
				Email: &emailUpdate,
			},
			expectedRes: datumclient.UpdateUser_UpdateUser_User{
				ID:          user.ID,
				FirstName:   &firstNameUpdate,
				LastName:    &lastNameUpdate, // this would have been updated on the prior test
				DisplayName: user.DisplayName,
				Email:       emailUpdate,
			},
		},
		{
			name: "update display name, happy path",
			updateInput: datumclient.UpdateUserInput{
				DisplayName: &displayNameUpdate,
			},
			expectedRes: datumclient.UpdateUser_UpdateUser_User{
				ID:          user.ID,
				FirstName:   &firstNameUpdate,
				LastName:    &lastNameUpdate,
				DisplayName: displayNameUpdate,
				Email:       emailUpdate, // this would have been updated on the prior test
			},
		},
		{
			name: "update name, too long",
			updateInput: datumclient.UpdateUserInput{
				FirstName: &nameUpdateLong,
			},
			errorMsg: "value is greater than the required length",
		},
		{
			name: "update with weak password",
			updateInput: datumclient.UpdateUserInput{
				Password: &weakPassword,
			},
			errorMsg: auth.ErrPasswordTooWeak.Error(),
		},
	}

	for _, tc := range testCases {
		t.Run("Update "+tc.name, func(t *testing.T) {
			defer mock_fga.ClearMocks(suite.client.fga)

			if tc.errorMsg == "" {
				mock_fga.CheckAny(t, suite.client.fga, true)
			}

			// update user
			resp, err := suite.client.datum.UpdateUser(reqCtx, user.ID, tc.updateInput)

			if tc.errorMsg != "" {
				require.Error(t, err)
				assert.ErrorContains(t, err, tc.errorMsg)
				assert.Nil(t, resp)

				return
			}

			require.NoError(t, err)
			require.NotNil(t, resp)
			require.NotNil(t, resp.UpdateUser.User)

			// Make sure provided values match
			updatedUser := resp.GetUpdateUser().User
			assert.Equal(t, tc.expectedRes.FirstName, updatedUser.FirstName)
			assert.Equal(t, tc.expectedRes.LastName, updatedUser.LastName)
			assert.Equal(t, tc.expectedRes.DisplayName, updatedUser.DisplayName)
			assert.Equal(t, tc.expectedRes.Email, updatedUser.Email)
		})
	}
}

func (suite *GraphTestSuite) TestMutationDeleteUser() {
	t := suite.T()

	// setup user context
	ctx, err := userContext()
	require.NoError(t, err)

	// bypass auth on object creation
	ctx = privacy.DecisionContext(ctx, privacy.Allow)

	user := (&UserBuilder{client: suite.client}).MustNew(ctx, t)

	userSetting := user.Edges.Setting

	// personal org will be the default org when the user is created
	personalOrgID := user.Edges.Setting.Edges.DefaultOrg.ID

	// setup valid user context
	reqCtx, err := auth.NewTestContextWithOrgID(user.ID, personalOrgID)
	require.NoError(t, err)

	testCases := []struct {
		name     string
		userID   string
		errorMsg string
	}{
		{
			name:   "delete user, happy path",
			userID: user.ID,
		},
		{
			name:     "delete user, not found",
			userID:   "tacos-tuesday",
			errorMsg: "not found",
		},
	}

	for _, tc := range testCases {
		t.Run("Delete "+tc.name, func(t *testing.T) {
			defer mock_fga.ClearMocks(suite.client.fga)

			// mock check calls
			if tc.errorMsg == "" {
				mock_fga.CheckAny(t, suite.client.fga, true)

				mock_fga.WriteAny(t, suite.client.fga)
			}

			// delete user
			resp, err := suite.client.datum.DeleteUser(reqCtx, tc.userID)

			if tc.errorMsg != "" {
				require.Error(t, err)
				assert.ErrorContains(t, err, tc.errorMsg)
				assert.Nil(t, resp)

				return
			}

			require.NoError(t, err)
			require.NotNil(t, resp)
			require.NotNil(t, resp.DeleteUser.DeletedID)

			// make sure the personal org is deleted
			org, err := suite.client.datum.GetOrganizationByID(reqCtx, personalOrgID)
			require.Nil(t, org)
			require.Error(t, err)
			assert.ErrorContains(t, err, "not found")

			// make sure the deletedID matches the ID we wanted to delete
			assert.Equal(t, tc.userID, resp.DeleteUser.DeletedID)

			// make sure the user setting is deleted
			out, err := suite.client.datum.GetUserSettingByID(reqCtx, userSetting.ID)
			require.Nil(t, out)
			require.Error(t, err)
			assert.ErrorContains(t, err, "not found")
		})
	}
}

func (suite *GraphTestSuite) TestMutationUserCascadeDelete() {
	t := suite.T()

	// setup user context
	ctx, err := userContext()
	require.NoError(t, err)

	user := (&UserBuilder{client: suite.client}).MustNew(ctx, t)

	reqCtx, err := auth.NewTestContextWithOrgID(user.ID, user.Edges.Setting.Edges.DefaultOrg.ID)
	require.NoError(t, err)

	token := (&PersonalAccessTokenBuilder{client: suite.client, OwnerID: user.ID}).MustNew(reqCtx, t)

	// mock checks
	mock_fga.CheckAny(t, suite.client.fga, true)
	// mock writes to clean up personal org
	mock_fga.WriteAny(t, suite.client.fga)

	// delete user
	resp, err := suite.client.datum.DeleteUser(reqCtx, user.ID)

	require.NoError(t, err)
	require.NotNil(t, resp)
	require.NotNil(t, resp.DeleteUser.DeletedID)

	// make sure the deletedID matches the ID we wanted to delete
	assert.Equal(t, user.ID, resp.DeleteUser.DeletedID)

	o, err := suite.client.datum.GetUserByID(reqCtx, user.ID)

	require.Nil(t, o)
	require.Error(t, err)
	assert.ErrorContains(t, err, "not found")

	g, err := suite.client.datum.GetPersonalAccessTokenByID(reqCtx, token.ID)
	require.Error(t, err)

	require.Nil(t, g)
	assert.ErrorContains(t, err, "not found")

	ctx = entx.SkipSoftDelete(reqCtx)

	// skip checks because tuples will be deleted at this point
	ctx = privacy.DecisionContext(ctx, privacy.Allow)

	o, err = suite.client.datum.GetUserByID(ctx, user.ID)
	require.NoError(t, err)

	require.Equal(t, o.User.ID, user.ID)

	// Bypass auth check to get owner of access token
	ctx = privacy.DecisionContext(ctx, privacy.Allow)

	g, err = suite.client.datum.GetPersonalAccessTokenByID(ctx, token.ID)
	require.NoError(t, err)

	require.Equal(t, g.PersonalAccessToken.ID, token.ID)
}

// func (suite *GraphTestSuite) TestMutationSoftDeleteUniqueIndex() {
// 	t := suite.T()

// 	// Setup echo context
// 	ec := echocontext.NewTestEchoContext()

// 	ctx := context.WithValue(ec.Request().Context(), echocontext.EchoContextKey, ec)

// 	ec.SetRequest(ec.Request().WithContext(ctx))

// 	input := datumclient.CreateUserInput{
// 		FirstName: lo.ToPtr("Abraxos"),
// 		LastName:  lo.ToPtr("Funk"),
// 		Email:     "abraxos@datum.net",
// 	}

// 	// skip auth checks because user creation is not generally allowed via a direct mutation
// 	ctx = privacy.DecisionContext(ctx, privacy.Allow)

// 	// mocks
// 	// the object ID doesn't matter here because we end up needing to bypass auth checks
// 	listObjects := []string{fmt.Sprintf("organization:%s", "test")}

// 	// write tuples for personal org on create, delete, and create again
// 	mock_fga.WriteAny(t, suite.client.fga)

// 	// check access for requests
// 	mock_fga.CheckAny(t, suite.client.fga, true)
// 	mock_fga.ListAny(t, suite.client.fga, listObjects)

// 	resp, err := suite.client.datum.CreateUser(ctx, input)
// 	require.NoError(t, err)

// 	// should fail on unique
// 	_, err = suite.client.datum.CreateUser(ctx, input)
// 	require.Error(t, err)
// 	assert.ErrorContains(t, err, "constraint failed")

// 	// setup valid user context
// 	userCtx, err := auth.NewTestEchoContextWithValidUser(resp.CreateUser.User.ID)
// 	if err != nil {
// 		t.Fatal()
// 	}

// 	reqCtx := context.WithValue(userCtx.Request().Context(), echocontext.EchoContextKey, userCtx)

// 	userCtx.SetRequest(ec.Request().WithContext(reqCtx))

// 	// delete user
// 	_, err = suite.client.datum.DeleteUser(userCtx.Request().Context(), resp.CreateUser.User.ID)
// 	require.NoError(t, err)

// 	// skip checks because tuples will be deleted at this point
// 	ctx = privacy.DecisionContext(ctx, privacy.Allow)

// 	o, err := suite.client.datum.GetUserByID(ctx, resp.CreateUser.User.ID)

// 	require.Nil(t, o)
// 	require.Error(t, err)
// 	assert.ErrorContains(t, err, "not found")

// 	// Ensure user is soft deleted
// 	ctx = entx.SkipSoftDelete(userCtx.Request().Context())

// 	o, err = suite.client.datum.GetUserByID(ctx, resp.CreateUser.User.ID)
// 	require.NoError(t, err)

// 	require.Equal(t, o.User.ID, resp.CreateUser.User.ID)

// 	// create the user again, this should work because we should ignore soft deleted
// 	// records on unique email
// 	// skip auth checks because user creation is not generally allowed via a direct mutation
// 	ctx = privacy.DecisionContext(ctx, privacy.Allow)
// 	resp, err = suite.client.datum.CreateUser(ctx, input)
// 	require.NoError(t, err)
// 	assert.Equal(t, input.Email, resp.CreateUser.User.Email)
// }
