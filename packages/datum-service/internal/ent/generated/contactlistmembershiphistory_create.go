// Code generated by ent, DO NOT EDIT.

package generated

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlistmembershiphistory"
	"github.com/datum-cloud/datum-os/pkg/enthistory"
)

// ContactListMembershipHistoryCreate is the builder for creating a ContactListMembershipHistory entity.
type ContactListMembershipHistoryCreate struct {
	config
	mutation *ContactListMembershipHistoryMutation
	hooks    []Hook
}

// SetHistoryTime sets the "history_time" field.
func (clmhc *ContactListMembershipHistoryCreate) SetHistoryTime(t time.Time) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetHistoryTime(t)
	return clmhc
}

// SetNillableHistoryTime sets the "history_time" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableHistoryTime(t *time.Time) *ContactListMembershipHistoryCreate {
	if t != nil {
		clmhc.SetHistoryTime(*t)
	}
	return clmhc
}

// SetRef sets the "ref" field.
func (clmhc *ContactListMembershipHistoryCreate) SetRef(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetRef(s)
	return clmhc
}

// SetNillableRef sets the "ref" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableRef(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetRef(*s)
	}
	return clmhc
}

// SetOperation sets the "operation" field.
func (clmhc *ContactListMembershipHistoryCreate) SetOperation(et enthistory.OpType) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetOperation(et)
	return clmhc
}

// SetCreatedAt sets the "created_at" field.
func (clmhc *ContactListMembershipHistoryCreate) SetCreatedAt(t time.Time) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetCreatedAt(t)
	return clmhc
}

// SetNillableCreatedAt sets the "created_at" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableCreatedAt(t *time.Time) *ContactListMembershipHistoryCreate {
	if t != nil {
		clmhc.SetCreatedAt(*t)
	}
	return clmhc
}

// SetUpdatedAt sets the "updated_at" field.
func (clmhc *ContactListMembershipHistoryCreate) SetUpdatedAt(t time.Time) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetUpdatedAt(t)
	return clmhc
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableUpdatedAt(t *time.Time) *ContactListMembershipHistoryCreate {
	if t != nil {
		clmhc.SetUpdatedAt(*t)
	}
	return clmhc
}

// SetCreatedBy sets the "created_by" field.
func (clmhc *ContactListMembershipHistoryCreate) SetCreatedBy(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetCreatedBy(s)
	return clmhc
}

// SetNillableCreatedBy sets the "created_by" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableCreatedBy(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetCreatedBy(*s)
	}
	return clmhc
}

// SetUpdatedBy sets the "updated_by" field.
func (clmhc *ContactListMembershipHistoryCreate) SetUpdatedBy(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetUpdatedBy(s)
	return clmhc
}

// SetNillableUpdatedBy sets the "updated_by" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableUpdatedBy(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetUpdatedBy(*s)
	}
	return clmhc
}

// SetMappingID sets the "mapping_id" field.
func (clmhc *ContactListMembershipHistoryCreate) SetMappingID(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetMappingID(s)
	return clmhc
}

// SetNillableMappingID sets the "mapping_id" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableMappingID(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetMappingID(*s)
	}
	return clmhc
}

// SetDeletedAt sets the "deleted_at" field.
func (clmhc *ContactListMembershipHistoryCreate) SetDeletedAt(t time.Time) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetDeletedAt(t)
	return clmhc
}

// SetNillableDeletedAt sets the "deleted_at" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableDeletedAt(t *time.Time) *ContactListMembershipHistoryCreate {
	if t != nil {
		clmhc.SetDeletedAt(*t)
	}
	return clmhc
}

// SetDeletedBy sets the "deleted_by" field.
func (clmhc *ContactListMembershipHistoryCreate) SetDeletedBy(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetDeletedBy(s)
	return clmhc
}

// SetNillableDeletedBy sets the "deleted_by" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableDeletedBy(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetDeletedBy(*s)
	}
	return clmhc
}

// SetContactListID sets the "contact_list_id" field.
func (clmhc *ContactListMembershipHistoryCreate) SetContactListID(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetContactListID(s)
	return clmhc
}

// SetContactID sets the "contact_id" field.
func (clmhc *ContactListMembershipHistoryCreate) SetContactID(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetContactID(s)
	return clmhc
}

// SetID sets the "id" field.
func (clmhc *ContactListMembershipHistoryCreate) SetID(s string) *ContactListMembershipHistoryCreate {
	clmhc.mutation.SetID(s)
	return clmhc
}

// SetNillableID sets the "id" field if the given value is not nil.
func (clmhc *ContactListMembershipHistoryCreate) SetNillableID(s *string) *ContactListMembershipHistoryCreate {
	if s != nil {
		clmhc.SetID(*s)
	}
	return clmhc
}

// Mutation returns the ContactListMembershipHistoryMutation object of the builder.
func (clmhc *ContactListMembershipHistoryCreate) Mutation() *ContactListMembershipHistoryMutation {
	return clmhc.mutation
}

// Save creates the ContactListMembershipHistory in the database.
func (clmhc *ContactListMembershipHistoryCreate) Save(ctx context.Context) (*ContactListMembershipHistory, error) {
	if err := clmhc.defaults(); err != nil {
		return nil, err
	}
	return withHooks(ctx, clmhc.sqlSave, clmhc.mutation, clmhc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (clmhc *ContactListMembershipHistoryCreate) SaveX(ctx context.Context) *ContactListMembershipHistory {
	v, err := clmhc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (clmhc *ContactListMembershipHistoryCreate) Exec(ctx context.Context) error {
	_, err := clmhc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (clmhc *ContactListMembershipHistoryCreate) ExecX(ctx context.Context) {
	if err := clmhc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (clmhc *ContactListMembershipHistoryCreate) defaults() error {
	if _, ok := clmhc.mutation.HistoryTime(); !ok {
		if contactlistmembershiphistory.DefaultHistoryTime == nil {
			return fmt.Errorf("generated: uninitialized contactlistmembershiphistory.DefaultHistoryTime (forgotten import generated/runtime?)")
		}
		v := contactlistmembershiphistory.DefaultHistoryTime()
		clmhc.mutation.SetHistoryTime(v)
	}
	if _, ok := clmhc.mutation.CreatedAt(); !ok {
		if contactlistmembershiphistory.DefaultCreatedAt == nil {
			return fmt.Errorf("generated: uninitialized contactlistmembershiphistory.DefaultCreatedAt (forgotten import generated/runtime?)")
		}
		v := contactlistmembershiphistory.DefaultCreatedAt()
		clmhc.mutation.SetCreatedAt(v)
	}
	if _, ok := clmhc.mutation.UpdatedAt(); !ok {
		if contactlistmembershiphistory.DefaultUpdatedAt == nil {
			return fmt.Errorf("generated: uninitialized contactlistmembershiphistory.DefaultUpdatedAt (forgotten import generated/runtime?)")
		}
		v := contactlistmembershiphistory.DefaultUpdatedAt()
		clmhc.mutation.SetUpdatedAt(v)
	}
	if _, ok := clmhc.mutation.MappingID(); !ok {
		if contactlistmembershiphistory.DefaultMappingID == nil {
			return fmt.Errorf("generated: uninitialized contactlistmembershiphistory.DefaultMappingID (forgotten import generated/runtime?)")
		}
		v := contactlistmembershiphistory.DefaultMappingID()
		clmhc.mutation.SetMappingID(v)
	}
	if _, ok := clmhc.mutation.ID(); !ok {
		if contactlistmembershiphistory.DefaultID == nil {
			return fmt.Errorf("generated: uninitialized contactlistmembershiphistory.DefaultID (forgotten import generated/runtime?)")
		}
		v := contactlistmembershiphistory.DefaultID()
		clmhc.mutation.SetID(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (clmhc *ContactListMembershipHistoryCreate) check() error {
	if _, ok := clmhc.mutation.HistoryTime(); !ok {
		return &ValidationError{Name: "history_time", err: errors.New(`generated: missing required field "ContactListMembershipHistory.history_time"`)}
	}
	if _, ok := clmhc.mutation.Operation(); !ok {
		return &ValidationError{Name: "operation", err: errors.New(`generated: missing required field "ContactListMembershipHistory.operation"`)}
	}
	if v, ok := clmhc.mutation.Operation(); ok {
		if err := contactlistmembershiphistory.OperationValidator(v); err != nil {
			return &ValidationError{Name: "operation", err: fmt.Errorf(`generated: validator failed for field "ContactListMembershipHistory.operation": %w`, err)}
		}
	}
	if _, ok := clmhc.mutation.MappingID(); !ok {
		return &ValidationError{Name: "mapping_id", err: errors.New(`generated: missing required field "ContactListMembershipHistory.mapping_id"`)}
	}
	if _, ok := clmhc.mutation.ContactListID(); !ok {
		return &ValidationError{Name: "contact_list_id", err: errors.New(`generated: missing required field "ContactListMembershipHistory.contact_list_id"`)}
	}
	if _, ok := clmhc.mutation.ContactID(); !ok {
		return &ValidationError{Name: "contact_id", err: errors.New(`generated: missing required field "ContactListMembershipHistory.contact_id"`)}
	}
	return nil
}

func (clmhc *ContactListMembershipHistoryCreate) sqlSave(ctx context.Context) (*ContactListMembershipHistory, error) {
	if err := clmhc.check(); err != nil {
		return nil, err
	}
	_node, _spec := clmhc.createSpec()
	if err := sqlgraph.CreateNode(ctx, clmhc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	if _spec.ID.Value != nil {
		if id, ok := _spec.ID.Value.(string); ok {
			_node.ID = id
		} else {
			return nil, fmt.Errorf("unexpected ContactListMembershipHistory.ID type: %T", _spec.ID.Value)
		}
	}
	clmhc.mutation.id = &_node.ID
	clmhc.mutation.done = true
	return _node, nil
}

func (clmhc *ContactListMembershipHistoryCreate) createSpec() (*ContactListMembershipHistory, *sqlgraph.CreateSpec) {
	var (
		_node = &ContactListMembershipHistory{config: clmhc.config}
		_spec = sqlgraph.NewCreateSpec(contactlistmembershiphistory.Table, sqlgraph.NewFieldSpec(contactlistmembershiphistory.FieldID, field.TypeString))
	)
	_spec.Schema = clmhc.schemaConfig.ContactListMembershipHistory
	if id, ok := clmhc.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = id
	}
	if value, ok := clmhc.mutation.HistoryTime(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldHistoryTime, field.TypeTime, value)
		_node.HistoryTime = value
	}
	if value, ok := clmhc.mutation.Ref(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldRef, field.TypeString, value)
		_node.Ref = value
	}
	if value, ok := clmhc.mutation.Operation(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldOperation, field.TypeEnum, value)
		_node.Operation = value
	}
	if value, ok := clmhc.mutation.CreatedAt(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldCreatedAt, field.TypeTime, value)
		_node.CreatedAt = value
	}
	if value, ok := clmhc.mutation.UpdatedAt(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldUpdatedAt, field.TypeTime, value)
		_node.UpdatedAt = value
	}
	if value, ok := clmhc.mutation.CreatedBy(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldCreatedBy, field.TypeString, value)
		_node.CreatedBy = value
	}
	if value, ok := clmhc.mutation.UpdatedBy(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldUpdatedBy, field.TypeString, value)
		_node.UpdatedBy = value
	}
	if value, ok := clmhc.mutation.MappingID(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldMappingID, field.TypeString, value)
		_node.MappingID = value
	}
	if value, ok := clmhc.mutation.DeletedAt(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldDeletedAt, field.TypeTime, value)
		_node.DeletedAt = value
	}
	if value, ok := clmhc.mutation.DeletedBy(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldDeletedBy, field.TypeString, value)
		_node.DeletedBy = value
	}
	if value, ok := clmhc.mutation.ContactListID(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldContactListID, field.TypeString, value)
		_node.ContactListID = value
	}
	if value, ok := clmhc.mutation.ContactID(); ok {
		_spec.SetField(contactlistmembershiphistory.FieldContactID, field.TypeString, value)
		_node.ContactID = value
	}
	return _node, _spec
}

// ContactListMembershipHistoryCreateBulk is the builder for creating many ContactListMembershipHistory entities in bulk.
type ContactListMembershipHistoryCreateBulk struct {
	config
	err      error
	builders []*ContactListMembershipHistoryCreate
}

// Save creates the ContactListMembershipHistory entities in the database.
func (clmhcb *ContactListMembershipHistoryCreateBulk) Save(ctx context.Context) ([]*ContactListMembershipHistory, error) {
	if clmhcb.err != nil {
		return nil, clmhcb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(clmhcb.builders))
	nodes := make([]*ContactListMembershipHistory, len(clmhcb.builders))
	mutators := make([]Mutator, len(clmhcb.builders))
	for i := range clmhcb.builders {
		func(i int, root context.Context) {
			builder := clmhcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ContactListMembershipHistoryMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, clmhcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, clmhcb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, clmhcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (clmhcb *ContactListMembershipHistoryCreateBulk) SaveX(ctx context.Context) []*ContactListMembershipHistory {
	v, err := clmhcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (clmhcb *ContactListMembershipHistoryCreateBulk) Exec(ctx context.Context) error {
	_, err := clmhcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (clmhcb *ContactListMembershipHistoryCreateBulk) ExecX(ctx context.Context) {
	if err := clmhcb.Exec(ctx); err != nil {
		panic(err)
	}
}
