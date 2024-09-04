package handlers

import (
	"net/http"

	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/getkin/kin-openapi/openapi3"

	"github.com/datum-cloud/datum-os/pkg/models"
	"github.com/datum-cloud/datum-os/pkg/rout"
)

func (h *Handler) ContactsGet(ctx echo.Context) error {
	// reply with the relevant details
	out := &models.ContactsGetResponse{
		Reply: rout.Reply{Success: true},
		Count: 20,
		Contacts: []models.ContactData{
			{ID: "01J6X14S34TP3H6Z4S3AVHJSMY", FullName: "Serene Ilsley", Address: "66195 Gateway Junction", Email: "silsley0@harvard.edu", Title: "Web Designer III", Company: "Crona-Dooley", PhoneNumber: "694-566-6857"},
			{ID: "01J6X14S355M2R0GP5WFX6QX91", FullName: "Bobbie Kolyagin", Address: "467 Magdeline Hill", Email: "bkolyagin1@blogs.com", Title: "VP Sales", Company: "Mosciski Group", PhoneNumber: "228-669-6638"},
			{ID: "01J6X14S367BDDX7W1ZT6XN2PH", FullName: "Erik Kernermann", Address: "27 Helena Alley", Email: "ekernermann2@phpbb.com", Title: "Web Developer II", Company: "Farrell-Hartmann", PhoneNumber: "379-425-9126"},
			{ID: "01J6X14S37R78N401F47VXCB6W", FullName: "Henri Wassung", Address: "85 Meadow Ridge Lane", Email: "hwassung3@odnoklassniki.ru", Title: "Compensation Analyst", Company: "Mayer LLC", PhoneNumber: "706-837-9556"},
			{ID: "01J6X14S389M3C0AR1VKYBR8E7", FullName: "Xenos Colbridge", Address: "4 Dorton Center", Email: "xcolbridge4@qq.com", Title: "Staff Scientist", Company: "O'Connell, Jakubowski and Hilll", PhoneNumber: "902-273-6691"},
			{ID: "01J6X14S3A72J8XPGC7JFPTYQ0", FullName: "Sydelle Cowherd", Address: "65 Coleman Avenue", Email: "scowherd5@umich.edu", Title: "GIS Technical Architect", Company: "Dibbert-Daniel", PhoneNumber: "925-420-4365"},
			{ID: "01J6X14S3BBZNR1WQPPHDBA2YY", FullName: "Cookie Bellay", Address: "97186 Dixon Junction", Email: "cbellay6@techcrunch.com", Title: "Staff Scientist", Company: "Sipes-Thompson", PhoneNumber: "921-511-9380"},
			{ID: "01J6X14S3CGZWQAZH28KX7Z8YM", FullName: "Lars Darinton", Address: "265 Brentwood Alley", Email: "ldarinton7@dailymotion.com", Title: "VP Product Management", Company: "Christiansen, Bahringer and Kuhn", PhoneNumber: "354-397-8116"},
			{ID: "01J6X14S3D86RBT9TJ8H3KHT2D", FullName: "Bella Redsall", Address: "0506 Melrose Lane", Email: "bredsall8@mtv.com", Title: "Senior Cost Accountant", Company: "Bauch Group", PhoneNumber: "111-505-7148"},
			{ID: "01J6X14S3EWEW4GXS0EEWXAT75", FullName: "Dorine Rumgay", Address: "762 Macpherson Way", Email: "drumgay9@blogtalkradio.com", Title: "Research Assistant I", Company: "Olson-Kuvalis", PhoneNumber: "290-428-2212"},
			{ID: "01J6X14S3FJ8Q0M32XMJ8RDEGM", FullName: "Giles Tulloch", Address: "68 Vera Pass", Email: "gtullocha@ftc.gov", Title: "Administrative Officer", Company: "Orn LLC", PhoneNumber: "246-646-7606"},
			{ID: "01J6X14S3G7CN58GN4PKWZ34XA", FullName: "Norina Suthworth", Address: "40145 Coolidge Point", Email: "nsuthworthb@sohu.com", Title: "Registered Nurse", Company: "Gulgowski, Langosh and Borer", PhoneNumber: "562-712-1990"},
			{ID: "01J6X14S3HJXZZBMVNTYXD4V3G", FullName: "Drusy Marginson", Address: "0996 Scott Drive", Email: "dmarginsonc@icq.com", Title: "Civil Engineer", Company: "Haley and Sons", PhoneNumber: "332-659-5848"},
			{ID: "01J6X14S3KET119H7B7P96FXE6", FullName: "Tito Hugin", Address: "7 Forest Drive", Email: "thugind@netvibes.com", Title: "Database Administrator III", Company: "Carter, McKenzie and Altenwerth", PhoneNumber: "526-912-4578"},
			{ID: "01J6X14S3MEQ7E7P7C852WP5VK", FullName: "Wenona Oxby", Address: "9 Corscot Way", Email: "woxbye@wunderground.com", Title: "Financial Analyst", Company: "Yost LLC", PhoneNumber: "581-153-5268"},
			{ID: "01J6X14S3P9HHH0YC7PGGCQKW8", FullName: "Gale Abrams", Address: "2849 Brown Park", Email: "gabramsf@ed.gov", Title: "Budget/Accounting Analyst III", Company: "Hamill Inc", PhoneNumber: "399-318-7178"},
			{ID: "01J6X14S3PGGVFM5TRJSJ96EF9", FullName: "Griff Debling", Address: "3912 Muir Road", Email: "gdeblingg@msu.edu", Title: "Internal Auditor", Company: "Rogahn and Sons", PhoneNumber: "637-477-0634"},
			{ID: "01J6X14S3Q8Q4ENKWY8X0T24CN", FullName: "Christos Crosher", Address: "3535 Talisman Park", Email: "ccrosherh@myspace.com", Title: "Health Coach II", Company: "Larson, Collins and Abbott", PhoneNumber: "693-497-0288"},
			{ID: "01J6X14S3R3YXED1R3A0ASTV2G", FullName: "Jermaine Rowcliffe", Address: "11 Bultman Park", Email: "jrowcliffei@gmpg.org", Title: "Systems Administrator III", Company: "Terry-Quitzon", PhoneNumber: "160-631-2754"},
			{ID: "01J6X14S3SEG1WGZJT15XWYYVV", FullName: "Albie Edinborough", Address: "26 Brown Terrace", Email: "aedinboroughj@bandcamp.com", Title: "Health Coach III", Company: "Goyette-Monahan", PhoneNumber: "873-949-9006"},
		},
	}

	return h.Created(ctx, out)
}

// BindOrganizationInviteAccept returns the OpenAPI3 operation for accepting an organization invite
func (h *Handler) BindContactsGet() *openapi3.Operation {
	contactsGet := openapi3.NewOperation()
	contactsGet.Description = "Get Contacts"
	contactsGet.OperationID = "ContactsGet"
	contactsGet.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddResponse("ContactsGetResponse", "success", models.ExampleContactsGetSuccessResponse, contactsGet, http.StatusOK)
	contactsGet.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsGet.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsGet
}
