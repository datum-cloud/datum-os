package models

import (
	"strings"
	"time"

	"github.com/go-webauthn/webauthn/protocol"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/pkg/passwd"
	"github.com/datum-cloud/datum-os/pkg/rout"
	"github.com/datum-cloud/datum-os/pkg/utils/ulids"
)

// =========
// Auth Data
// =========

type AuthData struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token,omitempty"`
	Session      string `json:"session,omitempty"`
	TokenType    string `json:"token_type,omitempty"`
}

// =========
// LOGIN
// =========

// LoginRequest holds the login payload for the /login route
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	OTPCode  string `json:"otp_code,omitempty"`
}

// LoginReply holds the response to LoginRequest
type LoginReply struct {
	rout.Reply
	AuthData
	Message string `json:"message"`
}

// Validate ensures the required fields are set on the LoginRequest request
func (r *LoginRequest) Validate() error {
	r.Username = strings.TrimSpace(r.Username)
	r.Password = strings.TrimSpace(r.Password)

	switch {
	case r.Username == "":
		return rout.NewMissingRequiredFieldError("username")
	case r.Password == "":
		return rout.NewMissingRequiredFieldError("password")
	}

	return nil
}

// ExampleLoginSuccessRequest is an example of a successful login request for OpenAPI documentation
var ExampleLoginSuccessRequest = LoginRequest{
	Username: "sfunky@datum.net",
	Password: "mitb!",
	OTPCode:  "123456",
}

// ExampleLoginSuccessResponse is an example of a successful login response for OpenAPI documentation
var ExampleLoginSuccessResponse = LoginReply{
	Reply: rout.Reply{
		Success: true,
	},
	AuthData: AuthData{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		Session:      "session",
		TokenType:    "bearer",
	},
}

// =========
// REFRESH
// =========

// RefreshRequest holds the fields that should be included on a request to the `/refresh` endpoint
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

// RefreshReply holds the fields that are sent on a response to the `/refresh` endpoint
type RefreshReply struct {
	rout.Reply
	Message string `json:"message,omitempty"`
	AuthData
}

// Validate ensures the required fields are set on the RefreshRequest request
func (r *RefreshRequest) Validate() error {
	if r.RefreshToken == "" {
		return rout.NewMissingRequiredFieldError("refresh_token")
	}

	return nil
}

// ExampleRefreshRequest is an example of a successful refresh request for OpenAPI documentation
var ExampleRefreshRequest = RefreshRequest{
	RefreshToken: "token",
}

// ExampleRefreshSuccessResponse is an example of a successful refresh response for OpenAPI documentation
var ExampleRefreshSuccessResponse = RefreshReply{
	Reply:   rout.Reply{Success: true},
	Message: "success",
	AuthData: AuthData{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		Session:      "session",
		TokenType:    "bearer",
	},
}

// =========
// REGISTER
// =========

// RegisterRequest holds the fields that should be included on a request to the `/register` endpoint
type RegisterRequest struct {
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// RegisterReply holds the fields that are sent on a response to the `/register` endpoint
type RegisterReply struct {
	rout.Reply
	ID      string `json:"user_id"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Token   string `json:"token"`
}

// Validate ensures the required fields are set on the RegisterRequest request
func (r *RegisterRequest) Validate() error {
	r.FirstName = strings.TrimSpace(r.FirstName)
	r.LastName = strings.TrimSpace(r.LastName)
	r.Email = strings.TrimSpace(r.Email)
	r.Password = strings.TrimSpace(r.Password)

	// Required for all requests
	switch {
	case r.Email == "":
		return rout.MissingField("email")
	case r.Password == "":
		return rout.MissingField("password")
	case passwd.Strength(r.Password) < passwd.Moderate:
		return rout.ErrPasswordTooWeak
	}

	return nil
}

// ExampleRegisterSuccessRequest is an example of a successful register request for OpenAPI documentation
var ExampleRegisterSuccessRequest = RegisterRequest{
	FirstName: "Sarah",
	LastName:  "Funk",
	Email:     "sfunky@datum.net",
	Password:  "mitb!",
}

// ExampleRegisterSuccessResponse is an example of a successful register response for OpenAPI documentation
var ExampleRegisterSuccessResponse = RegisterReply{
	Reply:   rout.Reply{Success: true},
	ID:      "1234",
	Email:   "",
	Message: "Welcome to Datum!",
	Token:   "",
}

// =========
// SWITCH ORGANIZATION
// =========

// SwitchOrganizationRequest contains the target organization ID being switched to for the /switch endpoint
type SwitchOrganizationRequest struct {
	TargetOrganizationID string `json:"target_organization_id"`
}

// SwitchOrganizationReply holds the new authentication and session information for the user for the new organization
type SwitchOrganizationReply struct {
	rout.Reply
	AuthData
}

// Validate ensures the required fields are set on the SwitchOrganizationRequest request
func (r *SwitchOrganizationRequest) Validate() error {
	if r.TargetOrganizationID == "" {
		return rout.NewMissingRequiredFieldError("target_organization_id")
	}

	return nil
}

// ExampleSwitchSuccessRequest is an example of a successful switch organization request for OpenAPI documentation
var ExampleSwitchSuccessRequest = SwitchOrganizationRequest{
	TargetOrganizationID: ulids.New().String(),
}

// ExampleSwitchSuccessReply is an example of a successful switch organization response for OpenAPI documentation
var ExampleSwitchSuccessReply = SwitchOrganizationReply{
	Reply: rout.Reply{
		Success: true,
	},
	AuthData: AuthData{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		Session:      "session",
		TokenType:    "bearer",
	},
}

// =========
// VERIFY EMAIL
// =========

// VerifyRequest holds the fields that should be included on a request to the `/verify` endpoint
type VerifyRequest struct {
	Token string `query:"token"`
}

// VerifyReply holds the fields that are sent on a response to the `/verify` endpoint
type VerifyReply struct {
	rout.Reply
	ID      string `json:"user_id"`
	Email   string `json:"email"`
	Token   string `json:"token"`
	Message string `json:"message,omitempty"`
	AuthData
}

// Validate ensures the required fields are set on the VerifyRequest request
func (r *VerifyRequest) Validate() error {
	if r.Token == "" {
		return rout.NewMissingRequiredFieldError("token")
	}

	return nil
}

// ExampleVerifySuccessRequest is an example of a successful verify request for OpenAPI documentation
var ExampleVerifySuccessRequest = VerifyRequest{
	Token: "token",
}

// ExampleVerifySuccessResponse is an example of a successful verify response for OpenAPI documentation
var ExampleVerifySuccessResponse = VerifyReply{
	Reply: rout.Reply{
		Success: true,
	},
	ID:      ulids.New().String(),
	Email:   "gregor.clegane@datum.net",
	Token:   "token",
	Message: "Email has been verified",
	AuthData: AuthData{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		Session:      "session",
		TokenType:    "bearer",
	},
}

// =========
// RESEND EMAIL
// =========

// ResendRequest contains fields for a resend email verification request to the `/resend` endpoint
type ResendRequest struct {
	Email string `json:"email"`
}

// ResendReply holds the fields that are sent on a response to the `/resend` endpoint
type ResendReply struct {
	rout.Reply
	Message string `json:"message"`
}

// Validate ensures the required fields are set on the ResendRequest request
func (r *ResendRequest) Validate() error {
	if r.Email == "" {
		return rout.NewMissingRequiredFieldError("email")
	}

	return nil
}

// ExampleResendEmailSuccessRequest is an example of a successful resend email request for OpenAPI documentation
var ExampleResendEmailSuccessRequest = ResendRequest{
	Email: "cercei.lannister@datum.net",
}

// ExampleResendEmailSuccessResponse is an example of a successful resend email response for OpenAPI documentation
var ExampleResendEmailSuccessResponse = ResendReply{
	Reply: rout.Reply{
		Success: true,
	},
	Message: "Email has been resent",
}

// =========
// FORGOT PASSWORD
// =========

// ForgotPasswordRequest contains fields for a forgot password request
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// ForgotPasswordReply contains fields for a forgot password response
type ForgotPasswordReply struct {
	rout.Reply
	Message string `json:"message,omitempty"`
}

// Validate ensures the required fields are set on the ForgotPasswordRequest request
func (r *ForgotPasswordRequest) Validate() error {
	if r.Email == "" {
		return rout.NewMissingRequiredFieldError("email")
	}

	return nil
}

// ExampleForgotPasswordSuccessRequest is an example of a successful forgot password request for OpenAPI documentation
var ExampleForgotPasswordSuccessRequest = ForgotPasswordRequest{
	Email: "example@datum.net",
}

// ExampleForgotPasswordSuccessResponse is an example of a successful forgot password response for OpenAPI documentation
var ExampleForgotPasswordSuccessResponse = ForgotPasswordReply{
	Reply: rout.Reply{
		Success: true,
	},
	Message: "We've received your request to have the password associated with this email reset. Please check your email.",
}

// =========
// RESET PASSWORD
// =========

// ResetPasswordRequest contains user input required to reset a user's password using /password-reset endpoint
type ResetPasswordRequest struct {
	Password string `json:"password"`
	Token    string `json:"token"`
}

// ResetPasswordReply is the response returned from a non-successful password reset request
// on success, no content is returned (204)
type ResetPasswordReply struct {
	rout.Reply
	Message string `json:"message"`
}

// Validate ensures the required fields are set on the ResetPasswordRequest request
func (r *ResetPasswordRequest) Validate() error {
	r.Password = strings.TrimSpace(r.Password)

	switch {
	case r.Token == "":
		return rout.NewMissingRequiredFieldError("token")
	case r.Password == "":
		return rout.NewMissingRequiredFieldError("password")
	case passwd.Strength(r.Password) < passwd.Moderate:
		return rout.ErrPasswordTooWeak
	}

	return nil
}

// ExampleResetPasswordSuccessRequest is an example of a successful reset password request for OpenAPI documentation
var ExampleResetPasswordSuccessRequest = ResetPasswordRequest{
	Password: "mitb!",
	Token:    "token",
}

// ExampleResetPasswordSuccessResponse is an example of a successful reset password response for OpenAPI documentation
var ExampleResetPasswordSuccessResponse = ResetPasswordReply{
	Reply: rout.Reply{
		Success: true,
	},
	Message: "Password has been reset",
}

// =========
// WEBAUTHN
// =========

// WebauthnRegistrationRequest is the request to begin a webauthn login
type WebauthnRegistrationRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

// WebauthnRegistrationResponse is the response to begin a webauthn login
// this includes the credential creation options and the session token
type WebauthnBeginRegistrationResponse struct {
	Reply rout.Reply
	*protocol.CredentialCreation
	Session string `json:"session,omitempty"`
}

// WebauthnRegistrationResponse is the response after a successful webauthn registration
type WebauthnRegistrationResponse struct {
	rout.Reply
	Message   string `json:"message,omitempty"`
	TokenType string `json:"token_type"`
	AuthData
}

// WebauthnBeginLoginResponse is the response to begin a webauthn login
// this includes the credential assertion options and the session token
type WebauthnBeginLoginResponse struct {
	Reply rout.Reply
	*protocol.CredentialAssertion
	Session string `json:"session,omitempty"`
}

// WebauthnRegistrationResponse is the response after a successful webauthn login
type WebauthnLoginResponse struct {
	rout.Reply
	Message string `json:"message,omitempty"`
	AuthData
}

// =========
// SUBSCRIBER VERIFY
// =========

// VerifySubscribeRequest holds the fields that should be included on a request to the `/subscribe/verify` endpoint
type VerifySubscribeRequest struct {
	Token string `query:"token"`
}

// VerifySubscribeReply holds the fields that are sent on a response to the `/subscribe/verify` endpoint
type VerifySubscribeReply struct {
	rout.Reply
	Message string `json:"message,omitempty"`
}

// Validate ensures the required fields are set on the VerifySubscribeRequest request
func (r *VerifySubscribeRequest) Validate() error {
	if r.Token == "" {
		return rout.NewMissingRequiredFieldError("token")
	}

	return nil
}

// ExampleVerifySubscriptionSuccessRequest is an example of a successful verify subscription request for OpenAPI documentation
var ExampleVerifySubscriptionSuccessRequest = VerifySubscribeRequest{
	Token: "token",
}

// ExampleVerifySubscriptionResponse is an example of a successful verify subscription response for OpenAPI documentation
var ExampleVerifySubscriptionResponse = VerifySubscribeReply{
	Reply:   rout.Reply{Success: true},
	Message: "Subscription confirmed, looking forward to sending you updates!",
}

// =========
// PUBLISH EVENT
// =========

// PublishRequest is the request payload for the event publisher
type PublishRequest struct {
	Tags    map[string]string `json:"tags"`
	Topic   string            `json:"topic"`
	Message string            `json:"message"`
}

// PublishReply holds the fields that are sent on a response to the `/event/publish` endpoint
type PublishReply struct {
	rout.Reply
	Message string `json:"message"`
}

// Validate ensures the required fields are set on the PublishRequest request
func (r *PublishRequest) Validate() error {
	switch {
	case r.Message == "":
		return rout.NewMissingRequiredFieldError("message")
	case r.Tags == nil:
		return rout.NewMissingRequiredFieldError("tags")
	case len(r.Tags) == 0:
		return rout.NewMissingRequiredFieldError("tags")
	case r.Topic == "":
		return rout.NewMissingRequiredFieldError("topic")
	}

	return nil
}

// ExamplePublishSuccessRequest is an example of a successful publish request for OpenAPI documentation
var ExamplePublishSuccessRequest = PublishRequest{
	Tags:    map[string]string{"tag1": "meow", "tag2": "meowzer"},
	Topic:   "meow",
	Message: "hot diggity dog",
}

// ExamplePublishSuccessResponse is an example of a successful publish response for OpenAPI documentation
var ExamplePublishSuccessResponse = PublishReply{
	Reply: rout.Reply{
		Success: true,
	},
	Message: "success!",
}

// =========
// ORGANIZATION INVITE
// =========

// InviteRequest holds the fields that should be included on a request to the `/invite` endpoint
type InviteRequest struct {
	Token string `query:"token"`
}

// InviteReply holds the fields that are sent on a response to an accepted invitation
type InviteReply struct {
	rout.Reply
	ID          string `json:"user_id"`
	Email       string `json:"email"`
	Message     string `json:"message"`
	JoinedOrgID string `json:"joined_org_id"`
	Role        string `json:"role"`
	AuthData
}

// Validate ensures the required fields are set on the InviteRequest request
func (r *InviteRequest) Validate() error {
	if r.Token == "" {
		return rout.NewMissingRequiredFieldError("token")
	}

	return nil
}

// ExampleInviteRequest is an example of a successful invite request for OpenAPI documentation
var ExampleInviteRequest = InviteRequest{
	Token: "token",
}

// ExampleInviteResponse is an example of a successful invite response for OpenAPI documentation
var ExampleInviteResponse = InviteReply{
	Reply:       rout.Reply{Success: true},
	ID:          "1234",
	Email:       "",
	JoinedOrgID: "1234",
	Role:        "admin",
	Message:     "Welcome to your new organization!",
	AuthData: AuthData{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		Session:      "session",
		TokenType:    "bearer",
	},
}

// =========
// OAUTH
// =========

// OauthTokenRequest to authenticate an oauth user with the Datum Server
type OauthTokenRequest struct {
	Name             string `json:"name"`
	Email            string `json:"email"`
	AuthProvider     string `json:"authProvider"`
	ExternalUserID   string `json:"externalUserId"`
	ExternalUserName string `json:"externalUserName"`
	ClientToken      string `json:"clientToken"`
	Image            string `json:"image,omitempty"`
}

// =========
// ACCOUNT/ACCESS
// =========

// AccountAccessRequest holds the fields that should be included on a request to the `/account/access` endpoint
type AccountAccessRequest struct {
	ObjectID    string `json:"objectId"`
	ObjectType  string `json:"objectType"`
	Relation    string `json:"relation"`
	SubjectType string `json:"subjectType,omitempty"`
}

// AccountAccessReply holds the fields that are sent on a response to the `/account/access` endpoint
type AccountAccessReply struct {
	rout.Reply
	Allowed bool `json:"allowed"`
}

// Validate ensures the required fields are set on the AccountAccessRequest
func (r *AccountAccessRequest) Validate() error {
	if r.ObjectID == "" {
		return rout.NewMissingRequiredFieldError("objectId")
	}

	if r.ObjectType == "" {
		return rout.NewMissingRequiredFieldError("objectType")
	}

	if r.Relation == "" {
		return rout.NewMissingRequiredFieldError("relation")
	}

	// Default to user if not set, only when using an API token should this be overwritten and set to service
	if r.SubjectType == "" {
		r.SubjectType = "user"
	}

	return nil
}

// ExampleAccountAccessRequest is an example of a successful `/account/access` request for OpenAPI documentation
var ExampleAccountAccessRequest = AccountAccessRequest{
	Relation:   "can_view",
	ObjectType: "organization",
	ObjectID:   "01J4EXD5MM60CX4YNYN0DEE3Y1",
}

// ExampleAccountAccessReply is an example of a successful `/account/access` response for OpenAPI documentation
var ExampleAccountAccessReply = AccountAccessReply{
	Reply:   rout.Reply{Success: true},
	Allowed: true,
}

// =========
// ACCOUNT/ROLES
// =========

// AccountRolesRequest holds the fields that should be included on a request to the `/account/roles` endpoint
type AccountRolesRequest struct {
	ObjectID    string   `json:"objectId"`
	ObjectType  string   `json:"objectType"`
	SubjectType string   `json:"subjectType,omitempty"`
	Relations   []string `json:"relations,omitempty"`
}

// AccountRolesReply holds the fields that are sent on a response to the `/account/roles` endpoint
type AccountRolesReply struct {
	rout.Reply
	Roles []string `json:"roles"`
}

// Validate ensures the required fields are set on the AccountAccessRequest
func (r *AccountRolesRequest) Validate() error {
	if r.ObjectID == "" {
		return rout.NewMissingRequiredFieldError("objectId")
	}

	if r.ObjectType == "" {
		return rout.NewMissingRequiredFieldError("objectType")
	}

	// Default to user if not set, only when using an API token should this be overwritten and set to service
	if r.SubjectType == "" {
		r.SubjectType = "user"
	}

	return nil
}

// ExampleAccountRolesRequest is an example of a successful `/account/roles` request for OpenAPI documentation
var ExampleAccountRolesRequest = AccountRolesRequest{
	ObjectType: "organization",
	ObjectID:   "01J4EXD5MM60CX4YNYN0DEE3Y1",
}

// ExampleAccountRolesReply is an example of a successful `/account/roles` response for OpenAPI documentation
var ExampleAccountRolesReply = AccountRolesReply{
	Reply: rout.Reply{Success: true},
	Roles: []string{"can_view", "can_edit", "audit_log_viewer"},
}

// =========
// ACCOUNT/ROLES/ORGANIZATION
// =========

// AccountRolesOrganizationRequest holds the fields that should be included on a request to the `/account/roles/organization` endpoint
type AccountRolesOrganizationRequest struct {
	ID string `param:"id"`
}

// AccountRolesOrganizationReply holds the fields that are sent on a response to the `/account/roles/organization` endpoint
type AccountRolesOrganizationReply struct {
	rout.Reply
	Roles          []string `json:"roles"`
	OrganizationID string   `json:"organization_id"`
}

// Validate ensures the required fields are set on the AccountAccessRequest
func (r *AccountRolesOrganizationRequest) Validate() error {
	if r.ID == "" {
		return rout.NewMissingRequiredFieldError("organization id")
	}

	return nil
}

// ExampleAccountRolesOrganizationRequest is an example of a successful `/account/roles/organization` request for OpenAPI documentation
var ExampleAccountRolesOrganizationRequest = AccountRolesOrganizationRequest{
	ID: "01J4HMNDSZCCQBTY93BF9CBF5D",
}

// ExampleAccountRolesOrganizationReply is an example of a successful `/account/roles/organization` response for OpenAPI documentation
var ExampleAccountRolesOrganizationReply = AccountRolesOrganizationReply{
	Reply:          rout.Reply{Success: true},
	Roles:          []string{"can_view", "can_edit", "audit_log_viewer"},
	OrganizationID: "01J4HMNDSZCCQBTY93BF9CBF5D",
}

// =========
// CONTACTS
// =========

// ContactsGetResponse is the body for a GET request response from the `/contacts` endpoint
type ContactsGetResponse struct {
	rout.Reply
	// the number of contacts returned in `Contacts`
	Count int `json:"count"`
	// the array of contacts
	Contacts []Contact `json:"contacts"`
}

// ContactsGetResponseFromGeneratedContacts is a helper function to return a `ContactsGetResponse` body from a `generated.Contact` slice
func ContactsGetResponseFromGeneratedContacts(genContacts []*generated.Contact) *ContactsGetResponse {
	cgr := &ContactsGetResponse{}
	cgr.Count = len(genContacts)
	cgr.Contacts = make([]Contact, cgr.Count)
	for i, genContact := range genContacts {
		cgr.Contacts[i] = ContactFromGeneratedContact(genContact)
		cgr.Contacts[i].Tags = append(cgr.Contacts[i].Tags, genContact.Tags...)
	}

	return cgr
}

// Contact holds the fields for a contact object that is sent as part of a POST or received as part of a GET request to `/contacts`
type Contact struct {
	ID string `json:"id,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// CreatedBy holds the value of the "created_by" field.
	CreatedBy string `json:"created_by,omitempty"`
	// UpdatedBy holds the value of the "updated_by" field.
	UpdatedBy string `json:"updated_by,omitempty"`
	// MappingID holds the value of the "mapping_id" field.
	MappingID string `json:"mapping_id,omitempty"`
	// DeletedAt holds the value of the "deleted_at" field.
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	// DeletedBy holds the value of the "deleted_by" field.
	DeletedBy string `json:"deleted_by,omitempty"`
	// tags associated with the object
	Tags []string `json:"tags,omitempty"`
	// The organization id that owns the object
	OwnerID string `json:"owner_id,omitempty"`
	// the full name of the contact
	FullName string `json:"full_name,omitempty"`
	// the title of the contact
	Title string `json:"title,omitempty"`
	// the company of the contact
	Company string `json:"company,omitempty"`
	// the email of the contact
	Email string `json:"email,omitempty"`
	// the phone number of the contact
	PhoneNumber string `json:"phone_number,omitempty"`
	// the address of the contact
	Address string `json:"address,omitempty"`
	// status of the contact
	Status string `json:"status,omitempty"`
	// contact lists that the contact is a member of
	ContactLists []ContactList `json:"contact_lists,omitempty"`
}

// ContactFromGeneratedContact is a helper function to return a `Contact` from a `generated.Contact`
func ContactFromGeneratedContact(genContact *generated.Contact) Contact {
	cd := Contact{}

	cd.ID = genContact.ID
	cd.CreatedAt = genContact.CreatedAt
	cd.UpdatedAt = genContact.UpdatedAt
	cd.CreatedBy = genContact.CreatedBy
	cd.UpdatedBy = genContact.UpdatedBy
	cd.MappingID = genContact.MappingID
	if !genContact.DeletedAt.IsZero() {
		cd.DeletedAt = &genContact.DeletedAt
	}
	cd.DeletedBy = genContact.DeletedBy
	cd.OwnerID = genContact.OwnerID
	cd.FullName = genContact.FullName
	cd.Title = genContact.Title
	cd.Company = genContact.Company
	cd.Email = genContact.Email
	cd.PhoneNumber = genContact.PhoneNumber
	cd.Address = genContact.Address
	cd.Status = string(genContact.Status)
	cd.ContactLists = make([]ContactList, len(genContact.Edges.ContactLists))
	for i, genContactList := range genContact.Edges.ContactLists {
		cd.ContactLists[i] = ContactListFromGeneratedContactList(genContactList)
	}

	return cd
}

// ExampleContactsGetSuccessResponse is an example response body for a GET request to `/contacts`
var ExampleContactsGetSuccessResponse = ContactsGetResponse{
	Reply: rout.Reply{Success: true},
	Count: 2,
	Contacts: []Contact{
		{
			ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
			Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
			ContactLists: []ContactList{
				{
					ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
					Name:        "weekly-tips",
					DisplayName: "Weekly Tips",
					Description: "For sending out weekly tips regarding new features",
				},
			},
		},
		{
			ID: "01J6X14S355M2R0GP5WFX6QX91", FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill",
			Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
			ContactLists: []ContactList{
				{
					ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
					Name:        "weekly-tips",
					DisplayName: "Weekly Tips",
					Description: "For sending out weekly tips regarding new features",
				},
			},
		},
	},
}

// ContactsGetOneRequest is the parameter for a GET request to `/contacts/:id`
type ContactsGetOneRequest struct {
	ID string `param:"id"`
}

// ContactsGetOneResponse is the body for a GET request response to `/contacts/:id`
type ContactsGetOneResponse struct {
	rout.Reply
	Contact
}

func ContactsGetOneResponseFromGeneratedContact(genContact *generated.Contact) *ContactsGetOneResponse {
	cgr := &ContactsGetOneResponse{Reply: rout.Reply{Success: true}}
	cgr.Contact = ContactFromGeneratedContact(genContact)

	return cgr
}

var ExampleContactsGetOneSuccessResponse = ContactsGetOneResponse{
	Reply: rout.Reply{Success: true},
	Contact: Contact{
		ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
		Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		ContactLists: []ContactList{
			{
				ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
				Name:        "weekly-tips",
				DisplayName: "Weekly Tips",
				Description: "For sending out weekly tips regarding new features",
			},
		},
	},
}

// ContactsPostRequest is the body for a POST request to `/contacts`
type ContactsPostRequest struct {
	Contacts []Contact `json:"contacts"`
}

// ContactsPostResponse is the body for a POST request response from `/contacts`
type ContactsPostResponse = ContactsGetResponse

// ExampleContactsPostRequest is an example of a valid body for a POST request to `/contacts`
var ExampleContactsPostRequest = ContactsPostRequest{
	Contacts: []Contact{
		{
			FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
			Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		},
		{
			FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill",
			Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
		},
	},
}

// ExampleContactsPostSuccessResponse is an example of a POST request response body from `/contacts`
var ExampleContactsPostSuccessResponse = ContactsPostResponse{
	Reply: rout.Reply{Success: true},
	Count: 2,
	Contacts: []Contact{
		{
			FullName: "Serene Ilsley", Address: "66195 Gateway Junction", Email: "silsley0@harvard.edu",
			Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		},
		{
			FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill", Email: "bkolyagin1@blogs.com",
			Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
		},
	},
}

// ContactsPutRequest is the body for a PUT request to `/contacts`
type ContactsPutRequest ContactsPostRequest

// ExampleContactsPutRequest is an example of a valid body for a PUT request to `/contacts`
var ExampleContactsPutRequest = ContactsPutRequest{
	Contacts: []Contact{
		{
			ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
			Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		},
		{
			ID: "01J6X14S355M2R0GP5WFX6QX91", FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill",
			Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
		},
	},
}

// ContactsPutResponse is the body for a PUT request response from `/contacts`
type ContactsPutResponse ContactsGetResponse

// ExampleContactsPutSuccessResponse is an example of a PUT request response body from `/contacts`
var ExampleContactsPutSuccessResponse = ContactsPutResponse{
	Reply: rout.Reply{Success: true},
	Count: 2,
	Contacts: []Contact{
		{
			ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
			Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		},
		{
			ID: "01J6X14S355M2R0GP5WFX6QX91", FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill",
			Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
		},
	},
}

// ContactsDeleteRequest is the body for a DELETE request to `/contacts`
type ContactsDeleteRequest struct {
	ContactIDs []string `json:"contact_ids"`
}

// ExampleContactsDeleteRequest is an example of a valid body for a DELETE request to `/contacts`
var ExampleContactsDeleteRequest = ContactsDeleteRequest{
	ContactIDs: []string{
		"01J6X14S34TP3H6Z4S3AVHJSMY",
		"01J6X14S355M2R0GP5WFX6QX91",
	},
}

// ContactsDeleteResponse is the body for a DELETE request response from `/contacts`
type ContactsDeleteResponse struct {
	CountAffected int `json:"count"`
	rout.Reply
}

// ExampleContactsDeleteSuccessResponse is an example of a DELETE request response body from `/contacts`
var ExampleContactsDeleteSuccessResponse = ContactsDeleteResponse{
	Reply:         rout.Reply{Success: true},
	CountAffected: 2,
}

// ContactListsGetResponse
type ContactListsGetResponse struct {
	rout.Reply
	Count        int           `json:"count"`
	ContactLists []ContactList `json:"contact_lists"`
}

// ContactList holds the fields for a ContactList
type ContactList struct {
	ID string `json:"id,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// CreatedBy holds the value of the "created_by" field.
	CreatedBy string `json:"created_by,omitempty"`
	// UpdatedBy holds the value of the "updated_by" field.
	UpdatedBy string `json:"updated_by,omitempty"`
	// DeletedAt holds the value of the "deleted_at" field.
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	// DeletedBy holds the value of the "deleted_by" field.
	DeletedBy string `json:"deleted_by,omitempty"`
	// MappingID holds the value of the "mapping_id" field.
	MappingID string `json:"mapping_id,omitempty"`
	// tags associated with the object
	Tags []string `json:"tags,omitempty"`
	// The organization id that owns the object
	OwnerID string `json:"owner_id,omitempty"`
	// the name of the list
	Name string `json:"name,omitempty"`
	// the visibility of the list, for the subscriber
	Visibility string `json:"visibility,omitempty"`
	// the friendly display name of the list
	DisplayName string `json:"display_name,omitempty"`
	// the description of the list
	Description string `json:"description,omitempty"`
	// the number of members in the list
	MemberCount *int `json:"member_count,omitempty"`
}

// ContactListFromGeneratedContactList is a helper function to return a `ContactList` from a `generated.ContactList`
func ContactListFromGeneratedContactList(genContactList *generated.ContactList) ContactList {
	cl := ContactList{}

	cl.ID = genContactList.ID
	cl.CreatedAt = genContactList.CreatedAt
	cl.UpdatedAt = genContactList.UpdatedAt
	cl.CreatedBy = genContactList.CreatedBy
	cl.UpdatedBy = genContactList.UpdatedBy
	cl.MappingID = genContactList.MappingID
	if !genContactList.DeletedAt.IsZero() {
		cl.DeletedAt = &genContactList.DeletedAt
	}
	cl.DeletedBy = genContactList.DeletedBy
	cl.OwnerID = genContactList.OwnerID
	cl.Name = genContactList.Name
	cl.Visibility = genContactList.Visibility
	cl.DisplayName = genContactList.DisplayName
	cl.Description = genContactList.Description

	return cl
}

// ContactListsGetResponseFromGeneratedContacts is a helper function to return a `ContactListsGetResponse` body from a `generated.ContactList` slice
func ContactListsGetResponseFromGeneratedContacts(genContactLists []*generated.ContactList) *ContactListsGetResponse {
	clgr := ContactListsGetResponse{}
	clgr.Count = len(genContactLists)
	clgr.ContactLists = make([]ContactList, clgr.Count)
	for i, genContactList := range genContactLists {
		clgr.ContactLists[i] = ContactListFromGeneratedContactList(genContactList)
		clgr.ContactLists[i].Tags = append(clgr.ContactLists[i].Tags, genContactList.Tags...)
	}

	clgr.Reply = rout.OK().Reply

	return &clgr
}

// ExampleContactListsGetSuccessResponse is an example of a GET request response from `/contacts/lists`
var ExampleContactListsGetSuccessResponse = ContactListsGetResponse{
	Reply: rout.OK().Reply,
	Count: 2,
	ContactLists: []ContactList{
		{
			ID:          "01J6X14S34TP3H6Z4S3AVHJSMY",
			Name:        "tos",
			DisplayName: "Terms of Service",
			Description: "For communicating changes to our terms of service",
		},
		{
			ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
			Name:        "weekly-tips",
			DisplayName: "Weekly Tips",
			Description: "For sending out weekly tips regarding new features",
		},
	},
}

// ContactListsGetOneRequest describes the parameters of a GET request to `/contacts/lists/:id`
type ContactListsGetOneRequest struct {
	ID string `param:"id"`
}

// ContactListsGetOneResponse is the body for a GET request response from `/contacts/lists/:id`
type ContactListsGetOneResponse struct {
	rout.Reply
	ContactList
}

// ContactListsGetOneResponseFromGeneratedContactList is a helper function to generate a `*ContactListsGetOneResponse` from a `*generated.ContactList`
func ContactListsGetOneResponseFromGeneratedContactList(genContactList *generated.ContactList) *ContactListsGetOneResponse {
	clgr := ContactListsGetOneResponse{}
	clgr.ContactList = ContactListFromGeneratedContactList(genContactList)
	clgr.Reply = rout.OK().Reply
	return &clgr
}

// ExampleContactListsGetOneSuccessResponse is an example of a GET request response from `/contacts/lists/:id`
var ExampleContactListsGetOneSuccessResponse = ContactListsGetOneResponse{
	Reply: rout.OK().Reply,
	ContactList: ContactList{
		ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
		Name:        "weekly-tips",
		DisplayName: "Weekly Tips",
		Description: "For sending out weekly tips regarding new features",
	},
}

// ContactListsPostRequest is the body for a POST request to `/contacts/lists`
type ContactListsPostRequest struct {
	ContactLists []ContactList `json:"contact_lists"`
}

// ExampleContactListsPostRequest is an example POST request to `/contacts/lists`
var ExampleContactListsPostRequest = ContactListsPostRequest{
	ContactLists: []ContactList{
		{
			Name:        "tos",
			DisplayName: "Terms of Service",
			Description: "For communicating changes to our terms of service",
			Visibility:  "PRIVATE",
		},
		{
			Name:        "weekly-tips",
			DisplayName: "Weekly Tips",
			Description: "For sending out weekly tips regarding new features",
			Visibility:  "PUBLIC",
		},
	},
}

// ContactListsPostResponse is the body for a POST request response from `/contacts/lists`
type ContactListsPostResponse = ContactListsGetResponse

// ContactListsPostResponseFromContactListsGetResponse is a helper function to return
func ContactListsPostResponseFromContactListsGetResponse(respGet *ContactListsGetResponse) *ContactListsPostResponse {
	var respPost *ContactListsPostResponse = respGet
	return respPost
}

// ContactListsPutRequest is the body for a PUT request to `/contacts/lists`
type ContactListsPutRequest struct {
	ContactLists []ContactList `json:"contact_lists"`
}

// ExampleContactListsPutRequest is an example PUT request to `/contacts/lists`
var ExampleContactListsPutRequest = ContactListsPutRequest{
	ContactLists: []ContactList{
		{
			ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
			Name:        "tos",
			DisplayName: "Terms of Service",
			Description: "For communicating changes to our terms of service",
			Visibility:  "PRIVATE",
		},
		{
			ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
			Name:        "weekly-tips",
			DisplayName: "Weekly Tips",
			Description: "For sending out weekly tips regarding new features",
			Visibility:  "PUBLIC",
		},
	},
}

// ContactListsPutResponse is the body for a PUT request response from `/contacts/lists`
type ContactListsPutResponse = ContactListsGetResponse

// ExampleContactListsPutSuccessResponse is an example PUT request response from `/contacts/lists`
var ExampleContactListsPutSuccessResponse = ContactListsPutResponse{
	Reply: rout.OK().Reply,
	Count: 2,
	ContactLists: []ContactList{
		{
			ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
			Name:        "tos",
			DisplayName: "Terms of Service",
			Description: "For communicating changes to our terms of service",
			Visibility:  "PRIVATE",
		},
		{
			ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
			Name:        "weekly-tips",
			DisplayName: "Weekly Tips",
			Description: "For sending out weekly tips regarding new features",
			Visibility:  "PUBLIC",
		},
	},
}

// ContactListsPutOneRequest is the body for a PUT request to `/contacts/lists/:id`
type ContactListsPutOneRequest struct {
	ContactListID string `param:"id"`
	ContactList
}

// ExampleContactListsPutOneRequest is an example PUT request to `/contacts/lists/:id`
var ExampleContactListsPutOneRequest = ContactListsPutOneRequest{
	ContactListID: "01J7PBEMJAZ08HKZF71302ZD1X",
	ContactList: ContactList{
		Name:        "weekly-tips",
		DisplayName: "Weekly Tips",
		Description: "For sending out weekly tips regarding new features",
		Visibility:  "PUBLIC",
	},
}

// ContactListsPutOneResponse is the body for a PUT request response from `/contacts/lists/:id`
type ContactListsPutOneResponse struct {
	rout.Reply
	ContactList
}

// ExampleContactListsPutOneSuccessResponse is an example PUT request response from `/contacts/lists/:id`
var ExampleContactListsPutOneSuccessResponse = ContactListsPutOneResponse{
	Reply: rout.OK().Reply,
	ContactList: ContactList{
		ID:          "01J7PBEMJAZ08HKZF71302ZD1X",
		Name:        "weekly-tips",
		DisplayName: "Weekly Tips",
		Description: "For sending out weekly tips regarding new features",
	},
}

// ContactListsDeleteRequest is the body for a DELETE request to `/contacts/lists`
type ContactListsDeleteRequest struct {
	ContactListIDs []string `json:"contact_list_ids"`
}

// ExampleContactListsDeleteRequest is an example DELETE request to `/contacts/lists`
var ExampleContactListsDeleteRequest = ContactListsDeleteRequest{
	ContactListIDs: []string{
		"01J7PBEMJAZ08HKZF71302ZD1X",
	},
}

// ContactListsDeleteResponse is the body for a DELETE request response from `/contacts/lists`
type ContactListsDeleteResponse struct {
	rout.Reply
	CountAffected int `json:"count"`
}

// ExampleContactListsDeleteSuccessResponse is an example DELETE request response from `/contacts/lists`
var ExampleContactListsDeleteSuccessResponse = ContactListsDeleteResponse{
	Reply:         rout.OK().Reply,
	CountAffected: 2,
}

// ContactListMembersGetRequest is the body for a GET request to `/contacts/lists/:id/members`
type ContactListMembersGetRequest struct {
	ContactListID string `param:"id"`
}

// ContactListMembersGetResponse is the body for a GET request response from `/contacts/lists/:id/members`
type ContactListMembersGetResponse struct {
	rout.Reply
	Count    int       `json:"count"`
	Contacts []Contact `json:"contacts"`
}

// ExampleContactListMembersGetSuccessResponse is an example GET request response from `/contacts/lists/:id/members`
var ExampleContactListMembersGetSuccessResponse = ContactListMembersGetResponse{
	Reply: rout.OK().Reply,
	Count: 2,
	Contacts: []Contact{
		{
			ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction",
			Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857",
		},
		{
			ID: "01J6X14S355M2R0GP5WFX6QX91", FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill",
			Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638",
		},
	},
}

// ContactsFromGeneratedContactListMembers is a helper function to return a `[]Contact` from a `[]*generated.ContactListMembership`
func ContactsFromGeneratedContactListMembers(members []*generated.ContactListMembership) []Contact {
	contacts := make([]Contact, len(members))
	for i, member := range members {
		contacts[i] = ContactFromGeneratedContact(member.Edges.Contact)
	}
	return contacts
}

// ContactListMembersPostRequest is the body for a POST request to `/contacts/lists/:id/members`
type ContactListMembersPostRequest struct {
	ContactListID string   `param:"id"`
	ContactIDs    []string `json:"contact_ids"`
}

// ExampleContactListMembersPostRequest is an example POST request to `/contacts/lists/:id/members`
var ExampleContactListMembersPostRequest = ContactListMembersPostRequest{
	ContactListID: "01J7PBEMJAZ08HKZF71302ZD1X",
	ContactIDs: []string{
		"01J6X14S34TP3H6Z4S3AVHJSMY",
		"01J6X14S355M2R0GP5WFX6QX91",
	},
}

// ContactListMembersPostResponse is the body for a POST request response from `/contacts/lists/:id/members`
type ContactListMembersPostResponse struct {
	rout.Reply
	CountAffected int `json:"count"`
}

// ExampleContactListMembersPostSuccessResponse is an example POST request response from `/contacts/lists/:id/members`
var ExampleContactListMembersPostSuccessResponse = ContactListMembersPostResponse{
	Reply:         rout.Reply{Success: true},
	CountAffected: 2,
}

// ContactListMembersDeleteRequest is the body for a DELETE request to `/contacts/lists/:id/members`
type ContactListMembersDeleteRequest struct {
	ContactListID string   `param:"id"`
	ContactIDs    []string `json:"contact_ids"`
}

// ExampleContactListMembersDeleteRequest is an example DELETE request to `/contacts/lists/:id/members`
var ExampleContactListMembersDeleteRequest = ContactListMembersDeleteRequest{
	ContactListID: "01J7PBEMJAZ08HKZF71302ZD1X",
	ContactIDs: []string{
		"01J6X14S34TP3H6Z4S3AVHJSMY",
		"01J6X14S355M2R0GP5WFX6QX91",
	},
}

// ContactListMembersDeleteResponse is the body for a DELETE request response from `/contacts/lists/:id/members`
type ContactListMembersDeleteResponse struct {
	rout.Reply
	CountAffected int `json:"count"`
}

// ExampleContactListMembersDeleteSuccessResponse is an example DELETE request response from `/contacts/lists/:id/members`
var ExampleContactListMembersDeleteSuccessResponse = ContactListMembersDeleteResponse{
	Reply:         rout.Reply{Success: true},
	CountAffected: 2,
}

// ContactListMembersDeleteOneRequest is the body for a DELETE request to `/contacts/lists/:id/members/:contact_id`
type ContactListMembersDeleteOneRequest struct {
	ContactListID string `param:"id"`
	ContactID     string `param:"contact_id"`
}

// ExampleContactListMembersDeleteOneRequest is an example DELETE request to `/contacts/lists/:id/members/:contact_id`
var ExampleContactListMembersDeleteOneRequest = ContactListMembersDeleteOneRequest{
	ContactListID: "01J7PBEMJAZ08HKZF71302ZD1X",
	ContactID:     "01J6X14S34TP3H6Z4S3AVHJSMY",
}

// ContactListMembersDeleteOneResponse is the body for a DELETE request response from `/contacts/lists/:id/members/:contact_id`
type ContactListMembersDeleteOneResponse struct {
	rout.Reply
	CountAffected int `json:"count"`
}

// ExampleContactListMembersDeleteOneSuccessResponse is an example DELETE request response from `/contacts/lists/:id/members/:contact_id`
var ExampleContactListMembersDeleteOneSuccessResponse = ContactListMembersDeleteOneResponse{
	Reply:         rout.Reply{Success: true},
	CountAffected: 1,
}
