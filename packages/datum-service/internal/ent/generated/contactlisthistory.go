// Code generated by ent, DO NOT EDIT.

package generated

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlisthistory"
	"github.com/datum-cloud/datum-os/pkg/enthistory"
)

// ContactListHistory is the model entity for the ContactListHistory schema.
type ContactListHistory struct {
	config `json:"-"`
	// ID of the ent.
	ID string `json:"id,omitempty"`
	// HistoryTime holds the value of the "history_time" field.
	HistoryTime time.Time `json:"history_time,omitempty"`
	// Ref holds the value of the "ref" field.
	Ref string `json:"ref,omitempty"`
	// Operation holds the value of the "operation" field.
	Operation enthistory.OpType `json:"operation,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// CreatedBy holds the value of the "created_by" field.
	CreatedBy string `json:"created_by,omitempty"`
	// UpdatedBy holds the value of the "updated_by" field.
	UpdatedBy string `json:"updated_by,omitempty"`
	// DeletedAt holds the value of the "deleted_at" field.
	DeletedAt time.Time `json:"deleted_at,omitempty"`
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
	Description  string `json:"description,omitempty"`
	selectValues sql.SelectValues
}

// scanValues returns the types for scanning values from sql.Rows.
func (*ContactListHistory) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case contactlisthistory.FieldTags:
			values[i] = new([]byte)
		case contactlisthistory.FieldOperation:
			values[i] = new(enthistory.OpType)
		case contactlisthistory.FieldID, contactlisthistory.FieldRef, contactlisthistory.FieldCreatedBy, contactlisthistory.FieldUpdatedBy, contactlisthistory.FieldDeletedBy, contactlisthistory.FieldMappingID, contactlisthistory.FieldOwnerID, contactlisthistory.FieldName, contactlisthistory.FieldVisibility, contactlisthistory.FieldDisplayName, contactlisthistory.FieldDescription:
			values[i] = new(sql.NullString)
		case contactlisthistory.FieldHistoryTime, contactlisthistory.FieldCreatedAt, contactlisthistory.FieldUpdatedAt, contactlisthistory.FieldDeletedAt:
			values[i] = new(sql.NullTime)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the ContactListHistory fields.
func (clh *ContactListHistory) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case contactlisthistory.FieldID:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value.Valid {
				clh.ID = value.String
			}
		case contactlisthistory.FieldHistoryTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field history_time", values[i])
			} else if value.Valid {
				clh.HistoryTime = value.Time
			}
		case contactlisthistory.FieldRef:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field ref", values[i])
			} else if value.Valid {
				clh.Ref = value.String
			}
		case contactlisthistory.FieldOperation:
			if value, ok := values[i].(*enthistory.OpType); !ok {
				return fmt.Errorf("unexpected type %T for field operation", values[i])
			} else if value != nil {
				clh.Operation = *value
			}
		case contactlisthistory.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				clh.CreatedAt = value.Time
			}
		case contactlisthistory.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				clh.UpdatedAt = value.Time
			}
		case contactlisthistory.FieldCreatedBy:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field created_by", values[i])
			} else if value.Valid {
				clh.CreatedBy = value.String
			}
		case contactlisthistory.FieldUpdatedBy:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field updated_by", values[i])
			} else if value.Valid {
				clh.UpdatedBy = value.String
			}
		case contactlisthistory.FieldDeletedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field deleted_at", values[i])
			} else if value.Valid {
				clh.DeletedAt = value.Time
			}
		case contactlisthistory.FieldDeletedBy:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field deleted_by", values[i])
			} else if value.Valid {
				clh.DeletedBy = value.String
			}
		case contactlisthistory.FieldMappingID:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field mapping_id", values[i])
			} else if value.Valid {
				clh.MappingID = value.String
			}
		case contactlisthistory.FieldTags:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field tags", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &clh.Tags); err != nil {
					return fmt.Errorf("unmarshal field tags: %w", err)
				}
			}
		case contactlisthistory.FieldOwnerID:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field owner_id", values[i])
			} else if value.Valid {
				clh.OwnerID = value.String
			}
		case contactlisthistory.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				clh.Name = value.String
			}
		case contactlisthistory.FieldVisibility:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field visibility", values[i])
			} else if value.Valid {
				clh.Visibility = string(value.String)
			}
		case contactlisthistory.FieldDisplayName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field display_name", values[i])
			} else if value.Valid {
				clh.DisplayName = value.String
			}
		case contactlisthistory.FieldDescription:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field description", values[i])
			} else if value.Valid {
				clh.Description = value.String
			}
		default:
			clh.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the ContactListHistory.
// This includes values selected through modifiers, order, etc.
func (clh *ContactListHistory) Value(name string) (ent.Value, error) {
	return clh.selectValues.Get(name)
}

// Update returns a builder for updating this ContactListHistory.
// Note that you need to call ContactListHistory.Unwrap() before calling this method if this ContactListHistory
// was returned from a transaction, and the transaction was committed or rolled back.
func (clh *ContactListHistory) Update() *ContactListHistoryUpdateOne {
	return NewContactListHistoryClient(clh.config).UpdateOne(clh)
}

// Unwrap unwraps the ContactListHistory entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (clh *ContactListHistory) Unwrap() *ContactListHistory {
	_tx, ok := clh.config.driver.(*txDriver)
	if !ok {
		panic("generated: ContactListHistory is not a transactional entity")
	}
	clh.config.driver = _tx.drv
	return clh
}

// String implements the fmt.Stringer.
func (clh *ContactListHistory) String() string {
	var builder strings.Builder
	builder.WriteString("ContactListHistory(")
	builder.WriteString(fmt.Sprintf("id=%v, ", clh.ID))
	builder.WriteString("history_time=")
	builder.WriteString(clh.HistoryTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("ref=")
	builder.WriteString(clh.Ref)
	builder.WriteString(", ")
	builder.WriteString("operation=")
	builder.WriteString(fmt.Sprintf("%v", clh.Operation))
	builder.WriteString(", ")
	builder.WriteString("created_at=")
	builder.WriteString(clh.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(clh.UpdatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("created_by=")
	builder.WriteString(clh.CreatedBy)
	builder.WriteString(", ")
	builder.WriteString("updated_by=")
	builder.WriteString(clh.UpdatedBy)
	builder.WriteString(", ")
	builder.WriteString("deleted_at=")
	builder.WriteString(clh.DeletedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("deleted_by=")
	builder.WriteString(clh.DeletedBy)
	builder.WriteString(", ")
	builder.WriteString("mapping_id=")
	builder.WriteString(clh.MappingID)
	builder.WriteString(", ")
	builder.WriteString("tags=")
	builder.WriteString(fmt.Sprintf("%v", clh.Tags))
	builder.WriteString(", ")
	builder.WriteString("owner_id=")
	builder.WriteString(clh.OwnerID)
	builder.WriteString(", ")
	builder.WriteString("name=")
	builder.WriteString(clh.Name)
	builder.WriteString(", ")
	builder.WriteString("visibility=")
	builder.WriteString(fmt.Sprintf("%v", clh.Visibility))
	builder.WriteString(", ")
	builder.WriteString("display_name=")
	builder.WriteString(clh.DisplayName)
	builder.WriteString(", ")
	builder.WriteString("description=")
	builder.WriteString(clh.Description)
	builder.WriteByte(')')
	return builder.String()
}

// ContactListHistories is a parsable slice of ContactListHistory.
type ContactListHistories []*ContactListHistory
