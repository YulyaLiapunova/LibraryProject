import { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  MRT_PaginationState,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import HistoryIcon from "@mui/icons-material/History";
import axios from "axios";

const LIBRARY_API = import.meta.env.VITE_LIBRARY_API;

type Book = {
  _id: string;
  name: string;
  authors: string;
  isbn: string;
  genre: ["Фэнтези", "Ужасы", "Роман"];
  year: number;
  rating: [1, 2, 3, 4, 5];
  borrowedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  dueDate: Date;
};

const Main = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [bookId, setBookId] = useState("");
  const [openBookHistory, setOpenBookHistory] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Название",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "authors",
        header: "Авторы",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.authors,
          helperText: validationErrors?.authors,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              authors: undefined,
            }),
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "isbn",
        header: "ISBN",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.isbn,
          helperText: validationErrors?.isbn,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              isbn: undefined,
            }),
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "genre",
        header: "Жанр",
        editVariant: "select",
        editSelectOptions: ["Фэнтези", "Ужасы", "Роман"],
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.genre,
          helperText: validationErrors?.genre,
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "year",
        header: "Год",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.year,
          helperText: validationErrors?.year,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              year: undefined,
            }),
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "rating",
        header: "Рейтинг",
        editVariant: "select",
        editSelectOptions: ["1", "2", "3", "4", "5"],
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.rating,
          helperText: validationErrors?.rating,
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "borrowedBy",
        header: "Взято",
        enableEditing: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => (
          <Box component="span">{cell.getValue() ? "User" : "-"}</Box>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Дата сдачи",
        enableEditing: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => (
          <Box component="span">
            {cell.getValue()
              ? new Date(cell.getValue<string>()).toDateString()
              : "-"}
          </Box>
        ),
      },
    ],
    [validationErrors]
  );

  const handleClickOpenBookHistory = () => {
    setOpenBookHistory(true);
  };

  const handleCloseBookHistory = () => {
    setOpenBookHistory(false);
  };

  //call CREATE hook
  const { mutateAsync: createBook, isPending: isCreatingBook } =
    useCreateBook();
  //call READ hook
  const {
    data: fetchedBooks = [],
    isError: isLoadingBooksError,
    isFetching: isFetchingBooks,
    isLoading: isLoadingBooks,
    refetch,
  } = useGetBooks({ pagination, globalFilter });
  //call UPDATE hook
  const { mutateAsync: updateBook, isPending: isUpdatingBook } =
    useUpdateBook();
  //call DELETE hook
  const { mutateAsync: deleteBook, isPending: isDeletingBook } =
    useDeleteBook();

  const { data: fetchedBookHistory = {} } = useGetBookHistory({ bookId });

  //CREATE action
  const handleCreateBook: MRT_TableOptions<Book>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateBook(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createBook(values);
    table.setCreatingRow(null);
  };
  //UPDATE action
  const handleSaveBook: MRT_TableOptions<Book>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateBook(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateBook(values);
    table.setEditingRow(null);
  };
  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>) => {
    if (window.confirm("Вы действительно хотите удалить книгу?")) {
      deleteBook(row.original._id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedBooks,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    initialState: {
      showGlobalFilter: true,
      showColumnFilters: false,
      density: "compact",
      columnVisibility: { _id: false },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: isLoadingBooksError
      ? {
          color: "error",
          children: "Ошибка при загрузке данных",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBook,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBook,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Добавить новую книгу</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Редактировать книгу</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActionMenuItems: ({ row, table }) => [
      <MenuItem
        key={0}
        onClick={() => {
          setBookId(row.original._id);
          handleClickOpenBookHistory();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <HistoryIcon />
        </ListItemIcon>
        Показать историю
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          table.setEditingRow(row);
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        Редактировать
      </MenuItem>,
      <MenuItem
        key={2}
        onClick={() => {
          openDeleteConfirmModal(row);
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        Удалить
      </MenuItem>,
    ],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Добавить новую книгу
        </Button>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingBooks,
      isSaving: isCreatingBook || isUpdatingBook || isDeletingBook,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isFetchingBooks,
      globalFilter,
      pagination,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />;
      <Dialog
        open={openBookHistory}
        onClose={handleCloseBookHistory}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{"История книги"}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {fetchedBookHistory.borrowHistory?.length ? (
              <List>
                {fetchedBookHistory.borrowHistory?.map(
                  (record: any, index: number) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Имя: ${record.user.firstName} | Фамилия: ${record.user.lastName} | Email: ${record.user.email}`}
                        secondary={`Даты пользования: ${new Date(
                          record.borrowedDate
                        ).toLocaleDateString("en-US")} - ${
                          (record.returnedDate &&
                            new Date(record.returnedDate).toLocaleDateString(
                              "en-US"
                            )) ||
                          "?"
                        } `}
                      />
                    </ListItem>
                  )
                )}
              </List>
            ) : (
              "Пусто"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookHistory}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

//CREATE hook (post new book to api)
function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, ...book }: Book) => {
      const response = await axios.post(`${LIBRARY_API}/books`, book);
      return response.data;
    },
    onMutate: (newBookInfo: Book) => {
      queryClient.setQueryData(
        ["books"],
        (prevBooks: any) =>
          [
            ...prevBooks,
            {
              ...newBookInfo,
            },
          ] as Book[]
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

//READ hook (get books from api)
function useGetBooks({
  globalFilter,
  pagination,
}: {
  globalFilter: string;
  pagination: MRT_PaginationState;
}) {
  return useQuery<Book[]>({
    queryKey: [
      "books",
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const offset = pagination.pageIndex * pagination.pageSize;
      const limit = pagination.pageSize;

      const search = globalFilter ?? "";

      const response = await axios.get(
        `${LIBRARY_API}/books?offset=${offset}&limit=${limit}&search=${search}`
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}

//READ hook (get book history from api)
function useGetBookHistory({ bookId }: { bookId: string }) {
  return useQuery<any>({
    queryKey: ["bookHistory", bookId],
    queryFn: async () => {
      if (!bookId) return;
      const response = await axios.get(
        `${LIBRARY_API}/books/${bookId}/history`
      );
      return response.data;
    },
  });
}

//UPDATE hook (put book in api)
function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, ...book }: Book) => {
      const response = await axios.post(`${LIBRARY_API}/books/${_id}`, book);
      return response.data;
    },
    //client side optimistic update
    onMutate: (newBookInfo: Book) => {
      queryClient.setQueryData(["books"], (prevBooks: any) =>
        prevBooks?.map((prevBook: Book) =>
          prevBook._id === newBookInfo._id ? newBookInfo : prevBook
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

//DELETE hook (delete book in api)
function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      const response = await axios.put(`${LIBRARY_API}/books/${bookId}`);
      return response.data;
    },
    //client side optimistic update
    onMutate: (bookId: string) => {
      queryClient.setQueryData(["books"], (prevBooks: any) =>
        prevBooks?.filter((book: Book) => book._id !== bookId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

const queryClient = new QueryClient();

const Books = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

export default Books;

const validateStringRequired = (value: string) => !!value?.length;
const validateArrayRequired = (value: string[]) => !!value?.length;
const validateNumberRequired = (value: number) => !!value;

function validateBook(book: Book) {
  return {
    name: !validateStringRequired(book.name)
      ? "Название книги является обязательным полем"
      : "",
    authors: !validateStringRequired(book.authors)
      ? "Авторы является обязательным полем"
      : "",
    isbn: !validateStringRequired(book.isbn)
      ? "ISBN является обязательным полем"
      : "",
    genre: !validateArrayRequired(book.genre)
      ? "Жанр является обязательным полем"
      : "",
    year: !validateNumberRequired(book.year)
      ? "Год издания является обязательным полем"
      : "",
    rating: !validateNumberRequired(book.year)
      ? "Рейтинг является обязательным полем"
      : "",
  };
}
